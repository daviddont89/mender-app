import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();
  const waveTranslate = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    // Start wave animation
    Animated.loop(
      Animated.timing(waveTranslate, {
        toValue: 300,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Screen1');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={styles.center}>
            <Animated.Text style={styles.menderText}>MENDER</Animated.Text>
          </View>
        }
      >
        <Animated.View
          style={[
            styles.waveFill,
            {
              transform: [{ translateX: waveTranslate }],
            },
          ]}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Background behind the wave + mask
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskedView: {
    height: 100,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menderText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    color: 'black', // Color doesn't matter — mask uses alpha channel
  },
  waveFill: {
    flex: 1,
    backgroundColor: 'white', // This appears *inside* the MENDER cutout
  },
});
