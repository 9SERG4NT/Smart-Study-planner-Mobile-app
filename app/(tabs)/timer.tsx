import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTasks } from '@/context/TaskContext';

const WORK_MINUTES  = 25;
const BREAK_MINUTES = 5;

export default function TimerScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { tasks, toggleTaskCompletion } = useTasks();

  // Resolve pre-loaded task from deep-link param
  const preloadedTask = taskId ? tasks.find(t => t.id === taskId) ?? null : null;
  const [activeTask, setActiveTask] = useState(preloadedTask);

  // Keep activeTask in sync if taskId changes
  useEffect(() => {
    if (taskId) {
      setActiveTask(tasks.find(t => t.id === taskId) ?? null);
    }
  }, [taskId, tasks]);

  const [isWorking, setIsWorking]     = useState(true);
  const [timeLeft,  setTimeLeft]      = useState(WORK_MINUTES * 60);
  const [isActive,  setIsActive]      = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft((t) => t - 1); }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (isWorking) setSessionsDone(s => s + 1);
      setIsWorking(!isWorking);
      setTimeLeft((!isWorking ? WORK_MINUTES : BREAK_MINUTES) * 60);
      setIsActive(false);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, isWorking]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer  = () => { setIsActive(false); setTimeLeft((isWorking ? WORK_MINUTES : BREAK_MINUTES) * 60); };
  const switchMode  = (mode: 'work' | 'break') => {
    setIsActive(false);
    setIsWorking(mode === 'work');
    setTimeLeft((mode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60);
  };
  const formatTime  = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>

      {/* ── Active task banner (pre-loaded from FocusGuard notification) ── */}
      {activeTask && (
        <View style={styles.taskBanner}>
          <View style={styles.taskBannerLeft}>
            <Ionicons name="book-outline" size={16} color="#6366f1" />
            <View style={styles.taskBannerText}>
              <Text style={styles.taskBannerLabel}>Studying</Text>
              <Text style={styles.taskBannerTitle} numberOfLines={1}>{activeTask.title}</Text>
            </View>
          </View>
          {sessionsDone > 0 && !activeTask.completed && (
            <TouchableOpacity
              style={styles.markDoneBtn}
              onPress={() => { toggleTaskCompletion(activeTask.id); setActiveTask(null); }}
            >
              <Text style={styles.markDoneBtnText}>Mark Done ✓</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.modeTabs}>
        <TouchableOpacity style={[styles.modeTab, isWorking && styles.modeTabActive]} onPress={() => switchMode('work')}>
          <Text style={[styles.modeText, isWorking && styles.modeTextActive]}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeTab, !isWorking && styles.modeTabActive]} onPress={() => switchMode('break')}>
          <Text style={[styles.modeText, !isWorking && styles.modeTextActive]}>Short Break</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, !isWorking && styles.timerCircleBreak]}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.phaseText}>{isWorking ? 'Stay Focused' : 'Take a breather'}</Text>
          {sessionsDone > 0 && (
            <Text style={styles.sessionsText}>🍅 {sessionsDone} session{sessionsDone > 1 ? 's' : ''} done</Text>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
          <Ionicons name="refresh" size={28} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.playButton, !isWorking && styles.playButtonBreak]} onPress={toggleTimer}>
          <Ionicons name={isActive ? 'pause' : 'play'} size={40} color="#ffffff" style={{ marginLeft: isActive ? 0 : 4 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => { setIsActive(false); setTimeLeft(0); }}>
          <Ionicons name="play-skip-forward" size={28} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', paddingTop: 20 },

  // Task banner
  taskBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#eef2ff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    width: '90%', marginBottom: 16, borderWidth: 1, borderColor: '#c7d2fe',
  },
  taskBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskBannerText: { flex: 1, marginLeft: 8 },
  taskBannerLabel: {
    fontSize: 11, color: '#6366f1', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  taskBannerTitle: { fontSize: 14, fontWeight: '700', color: '#1e1b4b' },
  markDoneBtn: {
    backgroundColor: '#6366f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8,
  },
  markDoneBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  // Mode tabs
  modeTabs: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 30, padding: 4, marginBottom: 40 },
  modeTab: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 26 },
  modeTabActive: {
    backgroundColor: '#ffffff', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  modeText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  modeTextActive: { color: '#111827' },

  // Timer circle
  timerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 48 },
  timerCircle: {
    width: 280, height: 280, borderRadius: 140, borderWidth: 8, borderColor: '#3b82f6',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  timerCircleBreak: { borderColor: '#22c55e', backgroundColor: '#f0fdf4', shadowColor: '#22c55e' },
  timeText: { fontSize: 72, fontWeight: '700', color: '#111827', fontVariant: ['tabular-nums'] },
  phaseText: { fontSize: 18, color: '#4b5563', marginTop: 8, fontWeight: '500' },
  sessionsText: { fontSize: 13, color: '#6b7280', marginTop: 6 },

  // Controls
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 40 },
  playButton: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#3b82f6',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 32,
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  playButtonBreak: { backgroundColor: '#22c55e', shadowColor: '#22c55e' },
  resetButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  skipButton:  { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
});
