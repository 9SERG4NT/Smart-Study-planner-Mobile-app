import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TaskProvider } from '@/context/TaskContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
    notification: '#ef4444',
  },
};

export default function RootLayout() {
  return (
    <TaskProvider>
      <ThemeProvider value={WhiteTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="task/add" options={{ presentation: 'modal', title: 'Add Task' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </TaskProvider>
  );
}
