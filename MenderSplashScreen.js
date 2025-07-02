// MenderSplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenderSplashScreen = () => {
  const navigation = useNavigation();
  const waveAnim = new Animated.Value(0);

  useEffect(() => {
    // Wave animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Navigate after 3 seconds
    const timeout = setTimeout(() => {
      navigation.replace('MenderOnboardingScreens');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./Icons/mender-banner.png')}
        style={styles.title}
      />
      <Animated.Image
        source={require('./Icons/tealwave.png')}
        style={[styles.wave, { transform: [{ translateY: waveAnim }] }]}
      />
    </View>
  );
};

export default MenderSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: '80%',
    height: undefined,
    aspectRatio: 4,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  wave: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
});
