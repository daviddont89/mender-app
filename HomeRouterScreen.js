// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// HomeRouterScreen.js

import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from './AuthProvider';

const HomeRouterScreen = ({ navigation }) => {
  const { user, userRole, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigation.replace('Login');
      } else if (userRole === 'contractor') {
        navigation.replace('Contractor Home');
      } else if (userRole === 'admin') {
        navigation.replace('Admin Dashboard');
      } else {
        navigation.replace('Client Home');
      }
    }
  }, [user, userRole, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#008080" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeRouterScreen;
