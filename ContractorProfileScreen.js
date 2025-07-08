// ContractorProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ContractorProfileScreen() {
  const handleEdit = () => {
    // Future: navigate to editable profile screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.label}>Name: John Doe</Text>
      <Text style={styles.label}>Trade: General Contractor</Text>
      <Text style={styles.label}>Experience: 5 years</Text>
      <Button title="Edit Profile (Coming Soon)" onPress={handleEdit} disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
});
