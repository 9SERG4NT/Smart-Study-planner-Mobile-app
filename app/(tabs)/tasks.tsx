import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TasksScreen() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['all', 'pending', 'completed'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No tasks found in this view.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
              <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.checkboxContainer}>
                <Ionicons 
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={28} 
                  color={item.completed ? '#3b82f6' : '#9ca3af'} 
                />
              </TouchableOpacity>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                  {item.title}
                </Text>
                <View style={styles.metaInfo}>
                  <Text style={styles.taskSubject}>{item.subject}</Text>
                  <Text style={styles.taskDate}>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/task/add')}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    opacity: 0.8,
  },
  checkboxContainer: {
    marginRight: 12,
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
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskSubject: {
    fontSize: 13,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  taskDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
