// SplashScreen.js

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const SplashScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const role = await AsyncStorage.getItem('userRole');
            if (role === 'contractor') {
              navigation.replace('ContractorHomeScreen');
            } else if (role === 'admin') {
              navigation.replace('AdminHomeScreen');
            } else {
              navigation.replace('ClientHomeScreen');
            }
          } catch (err) {
            navigation.replace('ClientHomeScreen');
          }
        } else {
          navigation.replace('MenderOnboardingScreen');
        }
      });
    }, 1500);

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
