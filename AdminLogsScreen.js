// AdminLogsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from './firebase';

export default function AdminLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsSnapshot = await getDocs(collection(db, 'logs'));
        const logsData = logsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfa5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activity Logs</Text>
      {logs.length === 0 ? (
        <Text style={styles.noLogs}>No logs found.</Text>
      ) : (
        logs.map(log => (
          <View key={log.id} style={styles.logItem}>
            <Text style={styles.logText}>{log.message || 'No message'}</Text>
            <Text style={styles.logTime}>{log.timestamp || 'No timestamp'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  noLogs: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  logItem: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
  },
  logText: {
    fontSize: 16,
    color: '#333',
  },
  logTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    textAlign: 'right',
  },
});
