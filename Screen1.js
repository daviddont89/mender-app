// Screen1.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Screen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./Icons/mender-icon.png')} style={styles.logo} />
      <Text style={styles.title}>How Mender Works</Text>
      <Text style={styles.text}>
        Mender connects clients with qualified contractors for household jobs. Post a job, get matched, and track progress all within the app.{"\n\n"}
        Clients pay $75/hr. Contractors earn $50/hr. All jobs include a one-hour minimum, covering drive time.{"\n\n"}
        Schedule, upload media, add gate codes, and rate jobs for better matches.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Screen2')}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#007D7B',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    flex: 1,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007D7B',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
