// HelpSupportScreen.js
import React from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';

export default function HelpSupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.text}>For support, email us at:</Text>
      <Text style={styles.link} onPress={() => Linking.openURL('mailto:support@menderapp.com')}>
        support@menderapp.com
      </Text>
      <Button title="Send Email" onPress={() => Linking.openURL('mailto:support@menderapp.com')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16 },
  link: { fontSize: 16, color: '#008080', marginVertical: 10 },
});
