import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { tasks, toggleTaskCompletion } = useTasks();
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

      {/* Today's Tasks List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <TouchableOpacity onPress={() => router.push('/tasks')}>
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
          </View>
        ))
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/timer')}>
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
});
