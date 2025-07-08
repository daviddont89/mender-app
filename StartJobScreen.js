// StartJobScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function StartJobScreen({ navigation }) {
  const handleStart = () => {
    // Future: update job status to "in progress"
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start This Job</Text>
      <Text style={styles.text}>Tap below when you're ready to begin working.</Text>
      <Button title="Start Job" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});
