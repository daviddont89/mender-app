// IncompleteJobScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function IncompleteJobScreen({ navigation }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    // Future: submit reason to Firestore and update job status
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Job as Incomplete</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason..."
        value={reason}
        onChangeText={setReason}
        multiline
      />
      <Button title="Submit Reason" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
});
