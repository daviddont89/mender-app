// MenderSplashScreen.js
import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function MenderSplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('./Icons/mender-banner.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Mender</Text>
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonSecondaryText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: '100%',
    maxWidth: 320,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#008080',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'MenderFont',
  },
  buttonPrimary: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    borderColor: '#008080',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
