import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const Controls = ({ onSteer, onAccelerate, onBrake }) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Left side - Steering */}
      <View style={styles.steeringArea}>
        <View
          style={styles.leftButton}
          onTouchStart={() => onSteer(-1)}
          onTouchEnd={() => onSteer(0)}
        >
          <View style={styles.arrowLeft} />
        </View>
        <View
          style={styles.rightButton}
          onTouchStart={() => onSteer(1)}
          onTouchEnd={() => onSteer(0)}
        >
          <View style={styles.arrowRight} />
        </View>
      </View>

      {/* Right side - Gas & Brake */}
      <View style={styles.pedalArea}>
        <View
          style={styles.brakeButton}
          onTouchStart={() => onBrake(true)}
          onTouchEnd={() => onBrake(false)}
        >
          <View style={styles.brakeIcon} />
        </View>
        <View
          style={styles.gasButton}
          onTouchStart={() => onAccelerate(true)}
          onTouchEnd={() => onAccelerate(false)}
        >
          <View style={styles.gasIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  steeringArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  leftButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  rightButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    borderBottomWidth: 12,
    borderBottomColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: '#fff',
    marginRight: 5,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    borderBottomWidth: 12,
    borderBottomColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: '#fff',
    marginLeft: 5,
  },
  pedalArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  brakeButton: {
    width: 65,
    height: 90,
    borderRadius: 15,
    backgroundColor: 'rgba(255,50,50,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,50,50,0.6)',
  },
  brakeIcon: {
    width: 25,
    height: 25,
    borderRadius: 4,
    backgroundColor: '#ff3333',
  },
  gasButton: {
    width: 65,
    height: 110,
    borderRadius: 15,
    backgroundColor: 'rgba(50,255,50,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(50,255,50,0.6)',
  },
  gasIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderBottomWidth: 25,
    borderBottomColor: '#33ff33',
  },
});
