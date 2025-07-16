// AdminDashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const loadedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(loadedUsers);
    } catch (err) {
      Alert.alert('Error', 'Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole =
      currentRole === 'client'
        ? 'contractor'
        : currentRole === 'contractor'
        ? 'admin'
        : 'client';

    try {
      setUpdatingId(userId);
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      Alert.alert('Success', `Updated role to: ${newRole}`);
      await loadUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      Alert.alert('Error', 'Could not update role.');
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Dashboard Tiles */}
      <View style={styles.statsRow}>
        <View style={styles.tile}><Text style={styles.tileNumber}>12</Text><Text>Pending Invoices</Text></View>
        <View style={styles.tile}><Text style={styles.tileNumber}>5</Text><Text>Pending Ads</Text></View>
        <View style={styles.tile}><Text style={styles.tileNumber}>3</Text><Text>Active Packages</Text></View>
        <View style={styles.tile}><Text style={styles.tileNumber}>8</Text><Text>Jobs Needing Help</Text></View>
      </View>

      {/* Admin Actions */}
      <Text style={styles.subheading}>Admin Tools</Text>
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminAdReviewScreen')}>
          <Text style={styles.actionText}>Review Ads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminPackageBuilderScreen')}>
          <Text style={styles.actionText}>Manage Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminInvoiceEditorScreen', { invoiceId: 'your-invoice-id' })}>
          <Text style={styles.actionText}>Review Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowUsers(!showUsers)}>
          <Text style={styles.actionText}>View Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('OpenJobsScreen')}>
          <Text style={styles.actionText}>View Jobs</Text>
        </TouchableOpacity>
      </View>

      {/* User Management Section */}
      {showUsers && (
        <>
          <Text style={[styles.subheading, { marginTop: 20 }]}>User Management</Text>
          {users.map((item) => (
            <View key={item.id} style={styles.userCard}>
              <Text style={styles.userText}>
                <Text style={{ fontWeight: 'bold' }}>{item.email}</Text> — {item.role}
              </Text>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => toggleRole(item.id, item.role)}
                disabled={updatingId === item.id}
              >
                <Text style={styles.roleButtonText}>
                  {updatingId === item.id ? 'Updating...' : 'Cycle Role'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#008080', textAlign: 'center',
  },
  subheading: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 10 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%', backgroundColor: '#e0f7fa', padding: 14, marginBottom: 14,
    borderRadius: 10, alignItems: 'center',
  },
  tileNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionBtn: {
    width: '48%', backgroundColor: '#008080', padding: 12, marginBottom: 12,
    borderRadius: 10, alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold' },
  userCard: {
    backgroundColor: '#f2f2f2', padding: 16, borderRadius: 10, marginBottom: 14,
  },
  userText: { fontSize: 16, marginBottom: 10 },
  roleButton: {
    backgroundColor: '#555', padding: 10, borderRadius: 8,
  },
  roleButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
