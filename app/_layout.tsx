import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TaskProvider } from '@/context/TaskContext';
import { FocusGuardProvider } from '@/context/FocusGuardContext';

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
      <FocusGuardProvider>
        <ThemeProvider value={WhiteTheme}>
          <Stack>
            <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
            <Stack.Screen name="task/add"            options={{ presentation: 'modal', title: 'Add Task' }} />
            <Stack.Screen name="focusguard-settings" options={{ presentation: 'modal', title: 'FocusGuard Settings' }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </FocusGuardProvider>
    </TaskProvider>
  );
}
