import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash from auto-hiding before we're ready
SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const timer = setTimeout(() => {
      onAuthStateChanged(auth, async (user) => {
        try {
          await SplashScreen.hideAsync();

          if (user) {
            const role = await AsyncStorage.getItem('userRole');
            if (role === 'contractor') {
              navigation.replace('ContractorHomeScreen');
            } else if (role === 'admin') {
              navigation.replace('AdminHomeScreen');
            } else {
              navigation.replace('ClientHomeScreen');
            }
          } else {
            navigation.replace('MenderOnboardingScreen');
          }
        } catch (err) {
          console.error('Splash navigation error:', err);
          await SplashScreen.hideAsync();
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

export default SplashScreenComponent;
