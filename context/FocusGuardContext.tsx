/**
 * FocusGuardContext.tsx
 *
 * Manages all FocusGuard state and background polling.
 *
 * NOTE: expo-notifications was removed from Expo Go with SDK 53.
 * This context uses NO expo-notifications — tier intervention is handled
 * entirely via in-app state (activeTier), which the UI reads to show banners.
 * When running as a dev build, native notifications can be wired back.
 *
 * Hardcoded defaults (per PRD):
 *   - Default daily limit : 45 minutes
 *   - Quiet hours         : 22:00 – 07:00
 *   - Poll interval       : 30 minutes (setInterval while app is open)
 *   - Tier thresholds     : 80 % → yellow, 100 % → orange, 200 % → red
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { NativeModules, Platform, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTasks, Task } from './TaskContext';

// ─── Native module — null when running in Expo Go ──────────────────────────────
const FocusGuardNative = NativeModules.FocusGuardModule ?? null;

// ─── Storage keys ──────────────────────────────────────────────────────────────
const KEY_ENABLED   = '@focusguard_enabled';
const KEY_THRESHOLD = '@focusguard_threshold_min';
const KEY_QS        = '@focusguard_quiet_start';
const KEY_QE        = '@focusguard_quiet_end';
const KEY_TIER_LOG  = '@focusguard_tier_log';      // {date, tiers[]}
const KEY_REPORTS   = '@focusguard_weekly_reports'; // WeeklyReport[]

// ─── Hardcoded defaults ────────────────────────────────────────────────────────
const DEFAULT_THRESHOLD = 45;
const DEFAULT_QS        = '22:00';
const DEFAULT_QE        = '07:00';

export const SOCIAL_APPS: Record<string, string> = {
  'com.instagram.android'      : 'Instagram',
  'com.whatsapp'               : 'WhatsApp',
  'com.facebook.katana'        : 'Facebook',
  'com.google.android.youtube' : 'YouTube',
  'com.snapchat.android'       : 'Snapchat',
};

// ─── Types ─────────────────────────────────────────────────────────────────────
export type InterventionTier = 'yellow' | 'orange' | 'red' | null;

export interface WeeklyReport {
  weekEndDate: string;           // 'YYYY-MM-DD'
  socialMinutes: number;
  studyMinutes: number;
  mostNeglectedSubject: string;
  suggestion: string;
}

export interface FocusGuardState {
  enabled: boolean;
  hasPermission: boolean;
  thresholdMin: number;
  quietStart: string;
  quietEnd: string;
  todayMinutes: number;
  perAppMinutes: Record<string, number>;
  activeTier: InterventionTier;
  /** Human-readable message for the current active tier — shown in UI banners */
  tierMessage: string;
  weeklyReports: WeeklyReport[];
  // Actions
  requestPermission: () => void;
  setEnabled: (v: boolean) => Promise<void>;
  setThreshold: (min: number) => Promise<void>;
  setQuietHours: (start: string, end: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const FocusGuardContext = createContext<FocusGuardState | undefined>(undefined);

// ─── Pure helpers ──────────────────────────────────────────────────────────────
function pickUrgentTask(tasks: Task[]): Task | null {
  const pending = tasks.filter(t => !t.completed);
  if (!pending.length) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueToday = pending.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  if (dueToday.length) return dueToday[0];
  const overdue = pending.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  });
  if (overdue.length) return overdue[0];
  return pending
    .filter(t => !!t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    ?? pending.sort((a, b) => Number(b.id) - Number(a.id))[0];
}

function isQuietHour(start: string, end: string): boolean {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  return s > e ? (cur >= s || cur < e) : (cur >= s && cur < e);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function buildTierMessage(
  tier: InterventionTier,
  usedMin: number,
  limitMin: number,
  urgentTask: Task | null,
  pendingCount: number,
): string {
  if (!tier) return '';
  if (tier === 'yellow') {
    return `📱 Heads up! ${usedMin}m of ${limitMin}m used. ${pendingCount} task${pendingCount !== 1 ? 's' : ''} pending.`;
  }
  if (tier === 'orange') {
    return urgentTask
      ? `🟠 Limit reached! Focus on "${urgentTask.title}" — tap the timer to start.`
      : `🟠 Daily limit reached (${usedMin}m). Time to study!`;
  }
  const hrs = (usedMin / 60).toFixed(1);
  return urgentTask
    ? `🔴 ${hrs}h on social media! "${urgentTask.title}" needs attention.`
    : `🔴 ${hrs}h on social media today. Open the timer and start studying!`;
}

// ─── Provider ──────────────────────────────────────────────────────────────────
export function FocusGuardProvider({ children }: { children: ReactNode }) {
  const { tasks } = useTasks();

  const [enabled,      setEnabledState]    = useState(false);
  const [hasPermission, setHasPermission]  = useState(false);
  const [thresholdMin,  setThresholdState] = useState(DEFAULT_THRESHOLD);
  const [quietStart,    setQS]             = useState(DEFAULT_QS);
  const [quietEnd,      setQE]             = useState(DEFAULT_QE);
  const [todayMinutes,  setTodayMinutes]   = useState(0);
  const [perAppMinutes, setPerApp]         = useState<Record<string, number>>({});
  const [activeTier,    setActiveTier]     = useState<InterventionTier>(null);
  const [tierMessage,   setTierMessage]    = useState('');
  const [weeklyReports, setWeeklyReports]  = useState<WeeklyReport[]>([]);

  // ── Load persisted settings ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [en, thresh, qs, qe, reports] = await Promise.all([
          AsyncStorage.getItem(KEY_ENABLED),
          AsyncStorage.getItem(KEY_THRESHOLD),
          AsyncStorage.getItem(KEY_QS),
          AsyncStorage.getItem(KEY_QE),
          AsyncStorage.getItem(KEY_REPORTS),
        ]);
        if (en      !== null) setEnabledState(en === 'true');
        if (thresh  !== null) setThresholdState(Number(thresh));
        if (qs      !== null) setQS(qs);
        if (qe      !== null) setQE(qe);
        if (reports !== null) setWeeklyReports(JSON.parse(reports));
      } catch (e) {
        console.warn('[FocusGuard] Settings load error:', e);
      }

      // Native permission (only in proper build)
      if (Platform.OS === 'android' && FocusGuardNative) {
        try {
          const perm = await FocusGuardNative.hasUsageStatsPermission();
          setHasPermission(perm);
        } catch (e) {
          console.warn('[FocusGuard] Permission check error:', e);
        }
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh usage from native module ─────────────────────────────────────────
  const refreshUsage = useCallback(async () => {
    if (!enabled || !hasPermission || Platform.OS !== 'android' || !FocusGuardNative) return;
    try {
      const result = await FocusGuardNative.getTodaySocialMediaMinutes();
      setTodayMinutes(result.totalMinutes ?? 0);
      setPerApp(result.perApp ?? {});
    } catch (e) {
      console.warn('[FocusGuard] Usage fetch error:', e);
    }
  }, [enabled, hasPermission]);

  // ── Tier evaluation — updates state, no push notifications ───────────────────
  const evaluateTier = useCallback(async () => {
    if (!enabled || !hasPermission) { setActiveTier(null); setTierMessage(''); return; }
    if (isQuietHour(quietStart, quietEnd)) return;

    const ratio = todayMinutes / thresholdMin;
    let tier: InterventionTier = null;
    if      (ratio >= 2)   tier = 'red';
    else if (ratio >= 1)   tier = 'orange';
    else if (ratio >= 0.8) tier = 'yellow';

    if (!tier) { setActiveTier(null); setTierMessage(''); return; }

    // Only escalate (don't downgrade within same day)
    const tierOrder: Record<string, number> = { yellow: 1, orange: 2, red: 3 };
    const currentRank = activeTier ? (tierOrder[activeTier] ?? 0) : 0;
    if ((tierOrder[tier] ?? 0) <= currentRank) return;

    const urgentTask = pickUrgentTask(tasks);
    const pending    = tasks.filter(t => !t.completed).length;
    const msg = buildTierMessage(tier, todayMinutes, thresholdMin, urgentTask, pending);

    setActiveTier(tier);
    setTierMessage(msg);

    // Persist that we reached this tier today (for reset logic)
    try {
      const today = todayStr();
      const raw   = await AsyncStorage.getItem(KEY_TIER_LOG);
      const log   = raw ? JSON.parse(raw) : { date: '', tiers: [] };
      const tiers = log.date === today ? log.tiers : [];
      if (!tiers.includes(tier)) {
        tiers.push(tier);
        await AsyncStorage.setItem(KEY_TIER_LOG, JSON.stringify({ date: today, tiers }));
      }
    } catch {}
  }, [enabled, hasPermission, todayMinutes, thresholdMin, quietStart, quietEnd, activeTier, tasks]);

  // ── Poll every 30 min ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    refreshUsage();
    const id = setInterval(refreshUsage, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [enabled, refreshUsage]);

  // ── Re-evaluate whenever usage changes ────────────────────────────────────────
  useEffect(() => { evaluateTier(); }, [todayMinutes, evaluateTier]);

  // ── Refresh when app comes to foreground ──────────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') refreshUsage();
    });
    return () => sub.remove();
  }, [refreshUsage]);

  // ── Weekly reality report (Sunday 20:00) ─────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const now = new Date();
      if (now.getDay() !== 0 || now.getHours() !== 20) return;
      const weekKey = todayStr();
      if (weeklyReports.some(r => r.weekEndDate === weekKey)) return;

      let weeklyMinutes = 0;
      if (Platform.OS === 'android' && FocusGuardNative) {
        try {
          const res = await FocusGuardNative.getWeekSocialMediaMinutes();
          weeklyMinutes = res.weeklyTotalMinutes ?? 0;
        } catch {}
      }

      const studyMinutes = tasks.filter(t => t.completed).length * 25;

      const subMap: Record<string, { total: number; inc: number }> = {};
      tasks.forEach(t => {
        if (!subMap[t.subject]) subMap[t.subject] = { total: 0, inc: 0 };
        subMap[t.subject].total++;
        if (!t.completed) subMap[t.subject].inc++;
      });
      const mostNeglected = Object.entries(subMap)
        .sort((a, b) => (b[1].inc / (b[1].total || 1)) - (a[1].inc / (a[1].total || 1)))[0]?.[0]
        ?? 'None';

      const diff = weeklyMinutes - studyMinutes;
      const suggestion = diff > 0
        ? `Try swapping ${Math.round(diff / 7)}min of daily social media for study time next week.`
        : 'Great week! Your study time exceeded social media usage. 🎉';

      const report: WeeklyReport = {
        weekEndDate: weekKey,
        socialMinutes: weeklyMinutes,
        studyMinutes,
        mostNeglectedSubject: mostNeglected,
        suggestion,
      };

      const updated = [report, ...weeklyReports].slice(0, 12);
      setWeeklyReports(updated);
      try {
        await AsyncStorage.setItem(KEY_REPORTS, JSON.stringify(updated));
      } catch {}
    };

    const id = setInterval(check, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [tasks, weeklyReports]);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const requestPermission = useCallback(() => {
    if (Platform.OS === 'android' && FocusGuardNative) {
      FocusGuardNative.requestUsageStatsPermission();
    } else {
      console.warn('[FocusGuard] Native module not available (Expo Go or iOS)');
    }
  }, []);

  const setEnabled = useCallback(async (v: boolean) => {
    setEnabledState(v);
    await AsyncStorage.setItem(KEY_ENABLED, String(v));
    if (v && Platform.OS === 'android' && FocusGuardNative) {
      try {
        const perm = await FocusGuardNative.hasUsageStatsPermission();
        setHasPermission(perm);
      } catch {}
    }
  }, []);

  const setThreshold = useCallback(async (min: number) => {
    setThresholdState(min);
    await AsyncStorage.setItem(KEY_THRESHOLD, String(min));
  }, []);

  const setQuietHours = useCallback(async (start: string, end: string) => {
    setQS(start);
    setQE(end);
    await AsyncStorage.setItem(KEY_QS, start);
    await AsyncStorage.setItem(KEY_QE, end);
  }, []);

  const clearHistory = useCallback(async () => {
    await AsyncStorage.multiRemove([KEY_TIER_LOG, KEY_REPORTS]);
    setWeeklyReports([]);
    setTodayMinutes(0);
    setPerApp({});
    setActiveTier(null);
    setTierMessage('');
  }, []);

  return (
    <FocusGuardContext.Provider value={{
      enabled, hasPermission, thresholdMin,
      quietStart, quietEnd,
      todayMinutes, perAppMinutes,
      activeTier, tierMessage,
      weeklyReports,
      requestPermission, setEnabled, setThreshold, setQuietHours,
      clearHistory, refreshUsage,
    }}>
      {children}
    </FocusGuardContext.Provider>
  );
}

export function useFocusGuard(): FocusGuardState {
  const ctx = useContext(FocusGuardContext);
  if (!ctx) throw new Error('useFocusGuard must be used within FocusGuardProvider');
  return ctx;
}
