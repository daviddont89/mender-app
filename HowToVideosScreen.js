// HowToVideosScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HowToVideosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How-To Videos</Text>
      <Text style={styles.text}>Tutorial videos will be added in future updates.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, textAlign: 'center', color: '#666' },
});
