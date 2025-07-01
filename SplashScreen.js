// SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth'); // Change to your real login stack
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
     <LottieView
  source={require('./assets/mender_wave.json')}
  autoPlay
  loop={false}
  style={{ width: 300, height: 300 }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: Dimensions.get('window').width * 0.9,
    height: 300,
  },
});
