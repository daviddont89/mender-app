// SplashScreen.js

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.navigate('MenderOnboarding');
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./Icons/mender-banner.png')}
        style={[styles.banner, { width: screenWidth * 0.9 }]}
        resizeMode="contain"
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
  banner: {
    height: 180,
  },
});

export default SplashScreen;
