/**
 * focusguard-settings.tsx
 * Full-screen FocusGuard configuration & Weekly Reality Reports screen.
 * Accessible via Tab navigation and notification deep-link.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity,
  Alert, Platform, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusGuard, SOCIAL_APPS, WeeklyReport } from '@/context/FocusGuardContext';
import { useRouter } from 'expo-router';

// ── Hardcoded threshold options (slider-like quick picks, 15–240 min per PRD FR-03) ──
const THRESHOLD_OPTIONS = [15, 30, 45, 60, 90, 120];

// ── Hardcoded demo usage data per app (shown in Expo Go / before native module loads) ──
// These represent a realistic "today's" usage snapshot for UI demonstration.
const APP_DEMO_DATA = [
  { pkg: 'com.instagram.android',       name: 'Instagram',  emoji: '📸', color: '#e1306c', demoMin: 18 },
  { pkg: 'com.whatsapp',                name: 'WhatsApp',   emoji: '💬', color: '#25d366', demoMin:  9 },
  { pkg: 'com.facebook.katana',         name: 'Facebook',   emoji: '👍', color: '#1877f2', demoMin:  6 },
  { pkg: 'com.google.android.youtube',  name: 'YouTube',    emoji: '▶️', color: '#ff0000', demoMin: 22 },
  { pkg: 'com.snapchat.android',        name: 'Snapchat',   emoji: '👻', color: '#fffc00', demoMin:  5 },
] as const;

export default function FocusGuardSettingsScreen() {
  const router  = useRouter();
  const fg      = useFocusGuard();

  const [pendingThreshold, setPendingThreshold] = useState(fg.thresholdMin);

  const handleEnable = async (val: boolean) => {
    if (val && !fg.hasPermission) {
      Alert.alert(
        'Permission Required',
        'FocusGuard needs Usage Access permission to monitor social media apps.\n\nYou will be taken to Android Settings. Enable "Smart Study Planner" in Usage Access.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              fg.requestPermission();
              fg.setEnabled(true);
            },
          },
        ]
      );
    } else {
      await fg.setEnabled(val);
    }
  };

  const handleThresholdSave = () => {
    fg.setThreshold(pendingThreshold);
    Alert.alert('Saved', `Daily limit set to ${pendingThreshold} minutes.`);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'This will erase all social media usage history and weekly reports. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => fg.clearHistory() },
      ]
    );
  };

  const formatMinutes = (min: number) => {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const tierBg = (tier: string | null) => {
    if (tier === 'red')    return '#fef2f2';
    if (tier === 'orange') return '#fff7ed';
    if (tier === 'yellow') return '#fffbeb';
    return '#f5f3ff';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Status Banner ────────────────────────────────────────────────── */}
      <View style={[styles.statusBanner, { backgroundColor: tierBg(fg.activeTier) }]}>
        <Ionicons
          name="shield-checkmark"
          size={36}
          color={
            fg.activeTier === 'red'    ? '#dc2626' :
            fg.activeTier === 'orange' ? '#ea580c' :
            fg.activeTier === 'yellow' ? '#d97706' : '#6366f1'
          }
        />
        <View style={styles.statusBannerText}>
          <Text style={styles.statusTitle}>FocusGuard</Text>
          <Text style={styles.statusSubtitle}>
            {!fg.enabled
              ? 'Currently disabled — tap to enable'
              : !fg.hasPermission
              ? '⚠️ Usage Access permission needed'
              : fg.activeTier
              ? `${fg.activeTier === 'red' ? '🔴' : fg.activeTier === 'orange' ? '🟠' : '🟡'} Active — ${fg.todayMinutes}m used of ${fg.thresholdMin}m`
              : `✅ Active — ${fg.todayMinutes}m used of ${fg.thresholdMin}m today`}
          </Text>
        </View>
      </View>

      {/* ── Enable / Disable ─────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="power" size={20} color="#6366f1" style={styles.rowIcon} />
            <View>
              <Text style={styles.rowLabel}>Enable FocusGuard</Text>
              <Text style={styles.rowSub}>Monitor daily social media usage</Text>
            </View>
          </View>
          {Platform.OS === 'android' ? (
            <Switch
              value={fg.enabled}
              onValueChange={handleEnable}
              trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }}
              thumbColor={fg.enabled ? '#6366f1' : '#f4f3f4'}
            />
          ) : (
            <Text style={styles.iosNote}>Android only</Text>
          )}
        </View>

        {!fg.hasPermission && fg.enabled && (
          <TouchableOpacity style={styles.permissionBtn} onPress={fg.requestPermission}>
            <Ionicons name="lock-open-outline" size={16} color="#ffffff" />
            <Text style={styles.permissionBtnText}>Grant Usage Access Permission</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Daily Threshold ──────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Social Media Limit</Text>
        <Text style={styles.sectionDesc}>
          Set the maximum daily social media time. Default is 45 min (PRD recommendation).
        </Text>

        {/* Quick-pick chips */}
        <View style={styles.chipRow}>
          {THRESHOLD_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, pendingThreshold === opt && styles.chipActive]}
              onPress={() => setPendingThreshold(opt)}
            >
              <Text style={[styles.chipText, pendingThreshold === opt && styles.chipTextActive]}>
                {formatMinutes(opt)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customRow}>
          <Text style={styles.customLabel}>Custom (minutes):</Text>
          <TextInput
            style={styles.customInput}
            keyboardType="number-pad"
            value={String(pendingThreshold)}
            onChangeText={v => {
              const n = parseInt(v, 10);
              if (!isNaN(n) && n >= 15 && n <= 240) setPendingThreshold(n);
            }}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleThresholdSave}>
          <Text style={styles.saveBtnText}>Save Limit</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quiet Hours ─────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiet Hours</Text>
        <Text style={styles.sectionDesc}>
          No FocusGuard notifications will be sent during quiet hours.
        </Text>
        <View style={styles.quietRow}>
          <View style={styles.quietItem}>
            <Text style={styles.quietLabel}>From</Text>
            <Text style={styles.quietValue}>{fg.quietStart}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#9ca3af" />
          <View style={styles.quietItem}>
            <Text style={styles.quietLabel}>To</Text>
            <Text style={styles.quietValue}>{fg.quietEnd}</Text>
          </View>
          <TouchableOpacity
            style={styles.quietEditBtn}
            onPress={() => Alert.alert('Quiet Hours', 'Default: 22:00 – 07:00\nEdit in a future release.')}
          >
            <Ionicons name="pencil-outline" size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Monitored Apps ───────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitored Apps</Text>
        <Text style={styles.sectionDesc}>
          All 5 apps are tracked simultaneously. Times below are today's usage.
        </Text>

        {APP_DEMO_DATA.map((app) => {
          // In a real build, perAppMinutes comes from native UsageStatsManager.
          // In Expo Go (no native module), we show hardcoded demo values.
          const liveMin = fg.perAppMinutes[app.pkg];
          const minutes = liveMin !== undefined ? liveMin : app.demoMin;
          const pct     = Math.min((minutes / fg.thresholdMin) * 100, 100);

          return (
            <View key={app.pkg} style={styles.appRow}>
              {/* App icon badge */}
              <View style={[styles.appIconBadge, { backgroundColor: app.color + '20' }]}>
                <Text style={styles.appEmoji}>{app.emoji}</Text>
              </View>

              {/* Name + progress */}
              <View style={styles.appInfo}>
                <View style={styles.appTopRow}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={[styles.appMinutes, { color: pct >= 100 ? '#dc2626' : pct >= 80 ? '#ea580c' : '#6b7280' }]}>
                    {minutes}m today
                  </Text>
                </View>
                {/* Mini progress bar */}
                <View style={styles.appBarBg}>
                  <View
                    style={[
                      styles.appBarFill,
                      {
                        width: `${pct}%` as any,
                        backgroundColor: pct >= 100 ? '#dc2626' : pct >= 80 ? '#ea580c' : app.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {/* Total row */}
        <View style={styles.appTotalRow}>
          <Text style={styles.appTotalLabel}>Total today</Text>
          <Text style={[styles.appTotalValue, { color: fg.todayMinutes > fg.thresholdMin ? '#dc2626' : '#111827' }]}>
            {fg.enabled && fg.hasPermission
              ? `${fg.todayMinutes}m`
              : `${APP_DEMO_DATA.reduce((s, a) => s + a.demoMin, 0)}m`
            } / {fg.thresholdMin}m limit
          </Text>
        </View>
      </View>

      {/* ── Weekly Reality Reports ───────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Reality Reports</Text>
        {fg.weeklyReports.length === 0 ? (
          <View style={styles.emptyReports}>
            <Ionicons name="calendar-outline" size={32} color="#d1d5db" />
            <Text style={styles.emptyReportsText}>
              Your first report will appear this Sunday at 8:00 PM
            </Text>
          </View>
        ) : (
          fg.weeklyReports.map((report, i) => (
            <ReportCard key={report.weekEndDate} report={report} index={i} />
          ))
        )}
      </View>

      {/* ── Danger Zone ──────────────────────────────────────────────────── */}
      <View style={[styles.section, styles.dangerSection]}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <Text style={styles.sectionDesc}>
          All data is stored entirely on your device. Nothing is ever uploaded.
        </Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearHistory}>
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
          <Text style={styles.dangerBtnText}>Clear All Usage History</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// ── Report Card component ──────────────────────────────────────────────────────
function ReportCard({ report, index }: { report: WeeklyReport; index: number }) {
  const socHr   = (report.socialMinutes / 60).toFixed(1);
  const studHr  = (report.studyMinutes  / 60).toFixed(1);
  const isOver  = report.socialMinutes > report.studyMinutes;
  const diffMin = Math.abs(report.socialMinutes - report.studyMinutes);
  const diffHr  = (diffMin / 60).toFixed(1);

  return (
    <View style={[styles.reportCard, index === 0 && styles.reportCardLatest]}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportDate}>Week of {report.weekEndDate}</Text>
        {index === 0 && <Text style={styles.reportLatestTag}>Latest</Text>}
      </View>
      <View style={styles.reportStats}>
        <View style={styles.reportStat}>
          <Text style={styles.reportStatEmoji}>📱</Text>
          <Text style={styles.reportStatValue}>{socHr}h</Text>
          <Text style={styles.reportStatLabel}>Social</Text>
        </View>
        <View style={[styles.reportStatDivider, { backgroundColor: isOver ? '#fca5a5' : '#86efac' }]} />
        <View style={styles.reportStat}>
          <Text style={styles.reportStatEmoji}>📚</Text>
          <Text style={styles.reportStatValue}>{studHr}h</Text>
          <Text style={styles.reportStatLabel}>Study</Text>
        </View>
      </View>
      <Text style={[styles.reportDiff, { color: isOver ? '#dc2626' : '#16a34a' }]}>
        {isOver
          ? `You spent ${diffHr}h more on social media than studying.`
          : `Great! You studied ${diffHr}h more than social media. 🎉`}
      </Text>
      <Text style={styles.reportNeglected}>
        Most neglected: <Text style={{ fontWeight: '700' }}>{report.mostNeglectedSubject}</Text>
      </Text>
      <Text style={styles.reportSuggestion}>💡 {report.suggestion}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingBottom: 60 },

  // Status banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  statusBannerText: { flex: 1 },
  statusTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  statusSubtitle: { fontSize: 13, color: '#4b5563', marginTop: 2 },

  // Sections
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerSection: { borderWidth: 1, borderColor: '#fee2e2' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionDesc: { fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 18 },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  iosNote: { fontSize: 12, color: '#9ca3af' },

  // Permission button
  permissionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  permissionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },

  // Threshold chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: { backgroundColor: '#eef2ff', borderColor: '#6366f1' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  chipTextActive: { color: '#6366f1' },
  customRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  customLabel: { fontSize: 14, color: '#374151', fontWeight: '500', marginRight: 12 },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },

  // Quiet hours
  quietRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
  },
  quietItem: { flex: 1, alignItems: 'center' },
  quietLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' },
  quietValue: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 2 },
  quietEditBtn: {
    padding: 8,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
  },

  // Monitored apps — richer row layout
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  appIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appEmoji: { fontSize: 18 },
  appInfo: { flex: 1 },
  appTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  appName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  appMinutes: { fontSize: 12, fontWeight: '700' },
  appBarBg: {
    height: 5,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  appBarFill: {
    height: 5,
    borderRadius: 3,
  },
  appTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  appTotalLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  appTotalValue: { fontSize: 14, fontWeight: '800' },

  // Reports
  emptyReports: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyReportsText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  reportCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reportCardLatest: {
    backgroundColor: '#f5f3ff',
    borderColor: '#c4b5fd',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportDate: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  reportLatestTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  reportStat: { alignItems: 'center', gap: 2 },
  reportStatEmoji: { fontSize: 20 },
  reportStatValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  reportStatLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  reportStatDivider: {
    width: 2,
    height: 40,
    borderRadius: 1,
  },
  reportDiff: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  reportNeglected: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  reportSuggestion: {
    fontSize: 12,
    color: '#7c3aed',
    backgroundColor: '#f5f3ff',
    padding: 8,
    borderRadius: 8,
    lineHeight: 17,
  },

  // Danger zone
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff5f5',
  },
  dangerBtnText: { color: '#dc2626', fontSize: 14, fontWeight: '600' },
});
