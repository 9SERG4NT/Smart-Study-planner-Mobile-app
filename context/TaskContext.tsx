import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO string Date format
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@study_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem('@study_tasks', JSON.stringify(tasksToSave));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskCompletion }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
