// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mender</Text>
      <Button
        title="Post a Job"
        onPress={() => navigation.navigate('PostJob')}
        color="#008080"
      />
      <View style={{ height: 12 }} />
      <Button
        title="My Jobs"
        onPress={() => navigation.navigate('MyJobs')}
        color="#444"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
