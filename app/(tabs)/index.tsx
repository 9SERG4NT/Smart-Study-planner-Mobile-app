import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { useFocusGuard } from '@/context/FocusGuardContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { tasks, toggleTaskCompletion } = useTasks();
  const fg = useFocusGuard();
  const router = useRouter();

  const { todayTasks, upcomingTasks, completedCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayCount: typeof tasks = [];
    let upcomingCount: typeof tasks = [];
    let completed = 0;

    tasks.forEach(task => {
      if (task.completed) {
        completed++;
        return;
      }

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate.getTime() === today.getTime()) {
        todayCount.push(task);
      } else if (dueDate.getTime() > today.getTime()) {
        upcomingCount.push(task);
      }
    });

    return {
      todayTasks: todayCount,
      upcomingTasks: upcomingCount,
      completedCount: completed,
    };
  }, [tasks]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#eff6ff' }]}>
          <Ionicons name="calendar" size={24} color="#3b82f6" />
          <Text style={styles.summaryValue}>{todayTasks.length}</Text>
          <Text style={styles.summaryLabel}>Due Today</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fcf5ff' }]}>
          <Ionicons name="time" size={24} color="#a855f7" />
          <Text style={styles.summaryValue}>{upcomingTasks.length}</Text>
          <Text style={styles.summaryLabel}>Upcoming</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#f0fdf4' }]}>
          <Ionicons name="checkmark-done" size={24} color="#22c55e" />
          <Text style={styles.summaryValue}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
      </View>

      {/* ── FocusGuard Today Widget ────────────────────────────────────── */}
      {Platform.OS === 'android' && (
        <TouchableOpacity
          style={[
            styles.fgCard,
            fg.activeTier === 'red'    ? styles.fgCardRed :
            fg.activeTier === 'orange' ? styles.fgCardOrange :
            fg.activeTier === 'yellow' ? styles.fgCardYellow :
            styles.fgCardDefault,
          ]}
          onPress={() => router.push('/focusguard-settings' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.fgCardHeader}>
            <View style={styles.fgTitleRow}>
              <Ionicons name="shield-checkmark" size={20} color={
                fg.activeTier === 'red' ? '#dc2626' :
                fg.activeTier === 'orange' ? '#ea580c' :
                fg.activeTier === 'yellow' ? '#d97706' : '#6366f1'
              } />
              <Text style={styles.fgTitle}>FocusGuard</Text>
              {fg.activeTier && (
                <View style={[
                  styles.fgTierBadge,
                  fg.activeTier === 'red'    ? { backgroundColor: '#fee2e2' } :
                  fg.activeTier === 'orange' ? { backgroundColor: '#ffedd5' } :
                                               { backgroundColor: '#fef9c3' },
                ]}>
                  <Text style={[
                    styles.fgTierText,
                    fg.activeTier === 'red'    ? { color: '#dc2626' } :
                    fg.activeTier === 'orange' ? { color: '#ea580c' } :
                                                 { color: '#ca8a04' },
                  ]}>
                    {fg.activeTier === 'red' ? '🔴 Deep Overuse' :
                     fg.activeTier === 'orange' ? '🟠 Limit Hit' : '🟡 Approaching'}
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>

          {fg.enabled && fg.hasPermission ? (
            <>
              <View style={styles.fgStats}>
                <Text style={styles.fgStatValue}>{fg.todayMinutes}m</Text>
                <Text style={styles.fgStatSep}>/</Text>
                <Text style={styles.fgLimitText}>{fg.thresholdMin}m limit</Text>
              </View>
              {/* Progress bar */}
              <View style={styles.fgProgressBg}>
                <View style={[
                  styles.fgProgressFill,
                  {
                    width: `${Math.min((fg.todayMinutes / fg.thresholdMin) * 100, 100)}%` as any,
                    backgroundColor:
                      fg.activeTier === 'red'    ? '#dc2626' :
                      fg.activeTier === 'orange' ? '#ea580c' :
                      fg.activeTier === 'yellow' ? '#f59e0b' : '#6366f1',
                  },
                ]} />
              </View>
              <Text style={styles.fgSubtext}>
                {fg.thresholdMin - fg.todayMinutes > 0
                  ? `${fg.thresholdMin - fg.todayMinutes}m remaining today`
                  : `${fg.todayMinutes - fg.thresholdMin}m over your daily limit`}
              </Text>
            </>
          ) : !fg.enabled ? (
            <TouchableOpacity
              style={styles.fgEnableBtn}
              onPress={() => router.push('/focusguard-settings' as any)}
            >
              <Text style={styles.fgEnableBtnText}>Enable FocusGuard →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.fgEnableBtn} onPress={fg.requestPermission}>
              <Text style={styles.fgEnableBtnText}>Grant Permission →</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}

      {/* Today's Tasks List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/tasks' as any)}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {todayTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="beer-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No tasks due today. Time to relax or get ahead!</Text>
        </View>
      ) : (
        todayTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => toggleTaskCompletion(task.id)}
            >
              <View style={[styles.checkboxInner, task.completed && styles.checkboxChecked]} />
            </TouchableOpacity>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskSubject}>{task.subject}</Text>
            </View>
            <TouchableOpacity
              style={styles.timerQuickBtn}
              onPress={() => router.push({ pathname: '/(tabs)/timer' as any, params: { taskId: task.id } })}
            >
              <Ionicons name="timer-outline" size={18} color="#6366f1" />
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/timer' as any)}>
          <Ionicons name="timer" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Start Pomodoro Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  summaryCard: {
    width: '31%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskSubject: {
    fontSize: 13,
    color: '#6b7280',
  },
  quickActions: {
    marginTop: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timerQuickBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    marginLeft: 8,
  },
  // ── FocusGuard widget styles ──────────────────────────────────────────────────
  fgCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  fgCardDefault: {
    backgroundColor: '#f5f3ff',
    borderColor: '#e0e7ff',
  },
  fgCardYellow: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  fgCardOrange: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  fgCardRed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  fgCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fgTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  fgTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e1b4b',
    marginLeft: 6,
  },
  fgTierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: 8,
  },
  fgTierText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fgStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
    gap: 4,
  },
  fgStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  fgStatSep: {
    fontSize: 18,
    color: '#9ca3af',
    marginHorizontal: 2,
  },
  fgLimitText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  fgProgressBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  fgProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  fgSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  fgEnableBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  fgEnableBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
});

