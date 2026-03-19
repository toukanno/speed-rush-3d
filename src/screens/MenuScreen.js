import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const MenuScreen = ({ onStart }) => {
  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleSub}>3D</Text>
        <Text style={styles.title}>SPEED RUSH</Text>
        <View style={styles.titleLine} />
        <Text style={styles.subtitle}>THE ULTIMATE RACE</Text>
      </View>

      {/* Car silhouette decoration */}
      <View style={styles.decorContainer}>
        <View style={styles.roadLine} />
        <View style={styles.carSilhouette}>
          <View style={styles.carBody} />
          <View style={styles.carCabin} />
          <View style={[styles.wheel, { left: 5 }]} />
          <View style={[styles.wheel, { right: 5 }]} />
        </View>
      </View>

      {/* Start button */}
      <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
        <Text style={styles.startText}>START RACE</Text>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>3 LAPS | 4 RACERS | 1 WINNER</Text>
      </View>

      {/* Controls hint */}
      <View style={styles.controlsHint}>
        <Text style={styles.hintText}>LEFT/RIGHT to steer | GREEN to accelerate | RED to brake</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0d1b2a',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#1b0d2a',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleSub: {
    fontSize: 24,
    color: '#ff3333',
    fontWeight: '900',
    letterSpacing: 15,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 8,
    textShadowColor: '#ff3333',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleLine: {
    width: 200,
    height: 3,
    backgroundColor: '#ff3333',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 10,
    fontWeight: '600',
  },
  decorContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  roadLine: {
    width: 250,
    height: 2,
    backgroundColor: '#333',
    marginBottom: 5,
  },
  carSilhouette: {
    width: 80,
    height: 30,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    bottom: 8,
    left: 5,
    right: 5,
    height: 12,
    backgroundColor: '#ff3333',
    borderRadius: 3,
  },
  carCabin: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    right: 20,
    height: 10,
    backgroundColor: '#cc2222',
    borderRadius: 3,
  },
  wheel: {
    position: 'absolute',
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#555',
  },
  startButton: {
    backgroundColor: '#ff3333',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#ff3333',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 5,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 3,
  },
  controlsHint: {
    position: 'absolute',
    bottom: 20,
  },
  hintText: {
    color: '#444',
    fontSize: 11,
    letterSpacing: 1,
  },
});
