// Screen3.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Screen3 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>For Clients & Contractors</Text>

      <Image
        source={require('./Icons/handshake.png')} // Make sure this exists in /icons/
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.text}>Mender connects reliable professionals with homeowners in need. Win-win.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Screen4')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Screen3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
    fontFamily: 'MenderFont',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
