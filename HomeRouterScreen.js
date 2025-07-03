// HomeRouterScreen.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';
import LoginScreen from './LoginScreen';

const HomeRouterScreen = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);
        } else {
          console.error('User document not found');
          setRole('client'); // fallback default
        }
      } catch (err) {
        console.error('Error fetching user role:', err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  switch (role) {
    case 'contractor':
      return <ContractorHomeScreen />;
    case 'admin':
      return <AdminHomeScreen />;
    case 'client':
    default:
      return <ClientHomeScreen />;
  }
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeRouterScreen;
