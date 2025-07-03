// AdminHomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminHomeScreen() {
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminUserList')}>
        <Text style={styles.buttonText}>Manage Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OpenJobs')}>
        <Text style={styles.buttonText}>View All Jobs</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminLogsScreen')}>
        <Text style={styles.buttonText}>System Logs</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminRatingScreen')}>
        <Text style={styles.buttonText}>Ratings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Account')}>
        <Text style={styles.buttonText}>Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#00bfa5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
