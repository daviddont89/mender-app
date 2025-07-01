// MenderSplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const MenderSplashScreen = ({ navigation }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Screen1');
    }, 3000); // adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('./assets/mender-wave-splash.json')}
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
  },
  animation: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MenderSplashScreen;
