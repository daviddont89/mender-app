// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import * as SplashScreenAPI from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';

SplashScreenAPI.preventAutoHideAsync();

export default function SplashScreen() {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onAuthStateChanged(auth, async (user) => {
        try {
          const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
          const role = await AsyncStorage.getItem('userRole');

          await SplashScreenAPI.hideAsync();

          if (user) {
            if (role === 'contractor') {
              navigation.replace('ContractorHomeScreen');
            } else if (role === 'admin') {
              navigation.replace('AdminHomeScreen');
            } else {
              navigation.replace('ClientHomeScreen');
            }
          } else {
            if (hasSeenIntro === 'true') {
              navigation.replace('MenderOnboardingScreen');
            } else {
              navigation.replace('IntroScreen');
            }
          }
        } catch (err) {
          console.error('Splash navigation error:', err);
          await SplashScreenAPI.hideAsync();
          navigation.replace('MenderOnboardingScreen');
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
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
}

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
