// CompleteJobScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CompleteJobScreen({ navigation }) {
  const handleComplete = () => {
    // Future: mark job as completed in Firestore
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Job as Complete</Text>
      <Text style={styles.text}>Confirm this job is fully completed.</Text>
      <Button title="Complete Job" onPress={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
