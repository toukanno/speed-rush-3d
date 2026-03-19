import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

const getOrdinal = (n) => {
  const suffixes = ['st', 'nd', 'rd', 'th'];
  return n + (suffixes[n - 1] || suffixes[3]);
};

export const GameHUD = ({ speed, lap, totalLaps, position, time, countdown, gameState }) => {
  const speedKmh = Math.round(speed * 120);
  const speedPercent = Math.min(speed / 2.5, 1);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Countdown */}
      {gameState === 'COUNTDOWN' && countdown > 0 && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {countdown > 0 ? Math.ceil(countdown) : 'GO!'}
          </Text>
        </View>
      )}

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.positionBox}>
          <Text style={styles.positionText}>{getOrdinal(position)}</Text>
          <Text style={styles.positionLabel}>POSITION</Text>
        </View>

        <View style={styles.timeBox}>
          <Text style={styles.timeText}>{formatTime(time)}</Text>
        </View>

        <View style={styles.lapBox}>
          <Text style={styles.lapText}>
            {Math.min(lap + 1, totalLaps)}/{totalLaps}
          </Text>
          <Text style={styles.lapLabel}>LAP</Text>
        </View>
      </View>

      {/* Speed gauge - bottom right */}
      <View style={styles.speedContainer}>
        <View style={styles.speedBarBg}>
          <View style={[styles.speedBarFill, {
            width: `${speedPercent * 100}%`,
            backgroundColor: speedPercent > 0.8 ? '#ff3333' : speedPercent > 0.5 ? '#ffaa00' : '#33ff33',
          }]} />
        </View>
        <Text style={styles.speedText}>{speedKmh}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  countdownContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
  },
  countdownText: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  positionBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  positionText: {
    color: '#ffcc00',
    fontSize: 28,
    fontWeight: 'bold',
  },
  positionLabel: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '600',
  },
  timeBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  lapBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  lapText: {
    color: '#33ccff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  lapLabel: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '600',
  },
  speedContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    minWidth: 120,
  },
  speedBarBg: {
    width: 100,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 5,
    overflow: 'hidden',
  },
  speedBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  speedText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  speedUnit: {
    color: '#aaa',
    fontSize: 12,
  },
});
