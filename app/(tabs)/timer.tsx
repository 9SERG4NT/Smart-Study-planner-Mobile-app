import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function TimerScreen() {
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Switch mode when time reaches 0
      setIsWorking(!isWorking);
      setTimeLeft((!isWorking ? WORK_MINUTES : BREAK_MINUTES) * 60);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWorking]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((isWorking ? WORK_MINUTES : BREAK_MINUTES) * 60);
  };

  const switchMode = (mode: 'work' | 'break') => {
    setIsActive(false);
    setIsWorking(mode === 'work');
    setTimeLeft((mode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercentage = isWorking
    ? ((WORK_MINUTES * 60 - timeLeft) / (WORK_MINUTES * 60)) * 100
    : ((BREAK_MINUTES * 60 - timeLeft) / (BREAK_MINUTES * 60)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.modeTabs}>
        <TouchableOpacity 
          style={[styles.modeTab, isWorking && styles.modeTabActive]}
          onPress={() => switchMode('work')}
        >
          <Text style={[styles.modeText, isWorking && styles.modeTextActive]}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, !isWorking && styles.modeTabActive]}
          onPress={() => switchMode('break')}
        >
          <Text style={[styles.modeText, !isWorking && styles.modeTextActive]}>Short Break</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, !isWorking && styles.timerCircleBreak]}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.phaseText}>
            {isWorking ? 'Stay Focused' : 'Take a breather'}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
          <Ionicons name="refresh" size={28} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.playButton, !isWorking && styles.playButtonBreak]} 
          onPress={toggleTimer}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={40} color="#ffffff" style={{ marginLeft: isActive ? 0 : 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => {
          setIsActive(false);
          setTimeLeft(0);
        }}>
          <Ionicons name="play-skip-forward" size={28} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 40,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 30,
    padding: 4,
    marginBottom: 60,
  },
  modeTab: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 26,
  },
  modeTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  modeTextActive: {
    color: '#111827',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  timerCircleBreak: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
    shadowColor: '#22c55e',
  },
  timeText: {
    fontSize: 72,
    fontWeight: '700',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  phaseText: {
    fontSize: 18,
    color: '#4b5563',
    marginTop: 8,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonBreak: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
