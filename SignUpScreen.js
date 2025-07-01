// Screen 5: Firebase Sign-Up
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseApp } from './firebase';

const auth = getAuth(firebaseApp);

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      navigation.navigate('MainHome');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => Alert.alert('Google sign-in coming soon')}>  
          <Image source={require('./Icons/Icons/google.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Facebook sign-in coming soon')}>  
          <Image source={require('./Icons/Icons/facebook.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004d4d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#999',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  loginText: {
    textAlign: 'center',
    color: '#008080',
    fontSize: 14,
    marginTop: 10,
  },
});

export default SignUpScreen;
