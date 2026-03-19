import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { RaceEngine } from '../game/RaceEngine';
import { GameHUD } from '../components/GameHUD';
import { Controls } from '../components/Controls';
import { ResultScreen } from './ResultScreen';
import { GAME, GAME_STATE } from '../game/constants';

const { width, height } = Dimensions.get('window');

export const GameScreen = ({ onBackToMenu }) => {
  const engineRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const [gameState, setGameState] = useState(GAME_STATE.COUNTDOWN);
  const [speed, setSpeed] = useState(0);
  const [lap, setLap] = useState(0);
  const [position, setPosition] = useState(1);
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState(GAME.COUNTDOWN_SECONDS);
  const [results, setResults] = useState([]);
  const [playerRank, setPlayerRank] = useState(1);

  const onContextCreate = useCallback((gl) => {
    const engine = new RaceEngine();
    engine.init(gl, width, height);
    engineRef.current = engine;

    // Set up callbacks
    engine.onStateChange = (state) => setGameState(state);
    engine.onLapChange = (l) => setLap(l);
    engine.onPositionChange = (p) => setPosition(p);
    engine.onCountdownTick = (c) => setCountdown(c);
    engine.onRaceFinished = (res, rank) => {
      setResults(res);
      setPlayerRank(rank);
    };

    // Start race
    engine.startRace();

    // Game loop
    const loop = () => {
      const now = Date.now();
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = now;

      if (engineRef.current) {
        engineRef.current.update(dt);
        engineRef.current.render();

        // Update HUD values
        setSpeed(engineRef.current.getSpeed());
        setTime(engineRef.current.getTime());
        setPosition(engineRef.current.getRank());

        gl.endFrameEXP();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, []);

  const handleSteer = useCallback((value) => {
    if (engineRef.current) {
      engineRef.current.setSteer(value);
    }
  }, []);

  const handleAccelerate = useCallback((value) => {
    if (engineRef.current) {
      engineRef.current.setAccelerate(value);
    }
  }, []);

  const handleBrake = useCallback((value) => {
    if (engineRef.current) {
      engineRef.current.setBrake(value);
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startRace();
      setLap(0);
      setSpeed(0);
      setTime(0);
      setPosition(1);
      setResults([]);
      lastTimeRef.current = null;
    }
  }, []);

  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
        msaaSamples={4}
      />

      <GameHUD
        speed={speed}
        lap={lap}
        totalLaps={GAME.LAPS}
        position={position}
        time={time}
        countdown={countdown}
        gameState={gameState}
      />

      {gameState === GAME_STATE.RACING && (
        <Controls
          onSteer={handleSteer}
          onAccelerate={handleAccelerate}
          onBrake={handleBrake}
        />
      )}

      {gameState === GAME_STATE.FINISHED && (
        <ResultScreen
          results={results}
          playerRank={playerRank}
          onRestart={handleRestart}
          onMenu={onBackToMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glView: {
    flex: 1,
  },
});
