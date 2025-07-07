// RoleRedirectScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { app } from './firebase';

export default function RoleRedirectScreen() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigation = useNavigation();

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return navigation.navigate('LoginScreen');
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const role = snap.data()?.role || 'client';
      if (role === 'contractor') navigation.replace('ContractorHomeScreen');
      else if (role === 'admin') navigation.replace('AdminDashboardScreen');
      else navigation.replace('ClientHomeScreen');
    };
    checkRole();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#007C91" />
    </View>
  );
}
