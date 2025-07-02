// MenderSplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const MenderSplashScreen = ({ navigation }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Screen1'); // Replace with your first onboarding screen
    }, 3000); // Adjust time to match animation length

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('./assets/mender_wave.json')}// ✅ fixed path + correct file name
        autoPlay
        loop={false}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MenderSplashScreen;
