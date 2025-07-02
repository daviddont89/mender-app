// ContactScreen.js

import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Mender Support</Text>

      <Text style={styles.label}>Email:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@menderapp.com')}>
        <Text style={styles.link}>support@menderapp.com</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Phone:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('tel:+18005551234')}>
        <Text style={styles.link}>1-800-555-1234</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Website:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://menderapp.com')}>
        <Text style={styles.link}>https://menderapp.com</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  link: {
    fontSize: 16,
    color: '#00aaa9',
    marginTop: 4,
  },
});
