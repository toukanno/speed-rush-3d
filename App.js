import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';

export default function App() {
  const [screen, setScreen] = useState('menu');

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {screen === 'menu' && (
        <MenuScreen onStart={() => setScreen('game')} />
      )}
      {screen === 'game' && (
        <GameScreen onBackToMenu={() => setScreen('menu')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
