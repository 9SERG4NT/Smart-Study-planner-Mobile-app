import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddTaskModal() {
  const { addTask } = useTasks();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  // Keeping it simple with dates for now
  const [daysFromNow, setDaysFromNow] = useState(0);

  const handleSave = () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Incomplete', 'Please fill out both the title and subject.');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysFromNow);

    addTask({
      title: title.trim(),
      subject: subject.trim(),
      dueDate: dueDate.toISOString(),
      completed: false,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Read Chapter 4"
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mathematics"
          placeholderTextColor="#9ca3af"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Due Date</Text>
        <View style={styles.dueTabs}>
          {[0, 1, 3, 7].map((days) => (
            <TouchableOpacity
              key={days}
              style={[styles.dueTab, daysFromNow === days && styles.dueTabActive]}
              onPress={() => setDaysFromNow(days)}
            >
              <Text style={[styles.dueTabText, daysFromNow === days && styles.dueTabTextActive]}>
                {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.saveButtonText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  dueTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dueTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dueTabActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  dueTabText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  dueTabTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
