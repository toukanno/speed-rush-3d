import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

export const ResultScreen = ({ results, playerRank, onRestart, onMenu }) => {
  const isWinner = playerRank === 1;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        {/* Result header */}
        <Text style={[styles.resultTitle, isWinner && styles.winnerTitle]}>
          {isWinner ? 'VICTORY!' : 'RACE COMPLETE'}
        </Text>

        <Text style={styles.rankText}>
          {getOrdinal(playerRank)} PLACE
        </Text>

        {/* Results table */}
        <View style={styles.resultsTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>POS</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>RACER</Text>
            <Text style={styles.headerText}>TIME</Text>
          </View>
          {results.map((result, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                result.name === 'Player' && styles.playerRow,
              ]}
            >
              <Text style={styles.rowPos}>{idx + 1}</Text>
              <Text style={[styles.rowName, { flex: 1 }]}>
                {result.name === 'Player' ? 'YOU' : result.name}
              </Text>
              <Text style={styles.rowTime}>{formatTime(result.time)}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.buttonText}>RACE AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
            <Text style={styles.buttonText}>MENU</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 350,
    maxWidth: 450,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 5,
    marginBottom: 5,
  },
  winnerTitle: {
    color: '#ffcc00',
    textShadowColor: '#ffcc00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  rankText: {
    fontSize: 22,
    color: '#aaa',
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 3,
  },
  resultsTable: {
    width: '100%',
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 5,
  },
  headerText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    width: 50,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  playerRow: {
    backgroundColor: 'rgba(255,51,51,0.2)',
  },
  rowPos: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    width: 50,
    textAlign: 'center',
  },
  rowName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rowTime: {
    color: '#aaa',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    width: 80,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  restartButton: {
    backgroundColor: '#ff3333',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  menuButton: {
    backgroundColor: '#444',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
