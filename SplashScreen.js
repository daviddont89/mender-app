// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    let isActive = true;
  
    const checkLogin = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          const start = Date.now();
          console.log('onAuthStateChanged fired. User:', user ? user.uid : null);
          let nextScreen = null;
          if (user) {
            let role = await AsyncStorage.getItem('userRole');
            console.log('Role from AsyncStorage:', role);
  
            if (!role) {
              try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  role = docSnap.data().role;
                  await AsyncStorage.setItem('userRole', role);
                  console.log('Role from Firestore:', role);
                }
              } catch (firestoreErr) {
                console.log('Splash Firestore error:', firestoreErr);
              }
            }
  
            if (role === 'client') nextScreen = 'ClientHomeScreen';
            else if (role === 'contractor') nextScreen = 'ContractorHomeScreen';
            else if (role === 'admin') nextScreen = 'AdminHomeScreen';
            else nextScreen = 'OnboardingScreen';
          } else {
            // Not logged in, check if user has seen intro
            const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
            if (!hasSeenIntro) {
              nextScreen = 'IntroScreen';
            } else {
              nextScreen = 'OnboardingScreen';
            }
          }
          // Ensure splash is visible for at least 1.5s
          const elapsed = Date.now() - start;
          const minSplash = 1500;
          setTimeout(() => {
            navigation.replace(nextScreen);
          }, Math.max(0, minSplash - elapsed));
        });
      } catch (error) {
        console.log('Splash checkLogin error:', error);
        navigation.replace('OnboardingScreen');
      } finally {
        await SplashScreen.hideAsync();
      }
    };
  
    checkLogin();
  
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./Icons/mender-banner.png')}
        style={[styles.logo, { width: screenWidth * 0.8 }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 80,
  },
});
