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
  const [metrics] = useState({
    totalUsers: 128,
    totalJobs: 342,
    totalEarnings: 48250,
    totalSubscriptions: 57,
  });

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

  const recentJobs = [
    { id: '1', title: 'Gutter Cleaning', client: 'Jane Client', status: 'Completed' },
    { id: '2', title: 'Deck Repair', client: 'Bob Smith', status: 'In Progress' },
    { id: '3', title: 'Winterizing', client: 'Alice Lee', status: 'Open' },
  ];
  const recentUsers = [
    { id: 'u1', name: 'Jane Client', role: 'client' },
    { id: 'u2', name: 'Carlos Martinez', role: 'contractor' },
    { id: 'u3', name: 'Admin User', role: 'admin' },
  ];
  const recentReviews = [
    { id: 'r1', reviewer: 'Jane Client', target: 'Carlos Martinez', rating: 5, text: 'Great work and communication!' },
    { id: 'r2', reviewer: 'Bob Smith', target: 'Jane Smith', rating: 4, text: 'Job done well, a bit late.' },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Analytics Dashboard */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalUsers}</Text>
          <Text style={styles.metricLabel}>Users</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalJobs}</Text>
          <Text style={styles.metricLabel}>Jobs</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>${metrics.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Earnings</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalSubscriptions}</Text>
          <Text style={styles.metricLabel}>Subscriptions</Text>
        </View>
      </View>
      {/* Recent Jobs */}
      <Text style={styles.sectionTitle}>Recent Jobs</Text>
      {recentJobs.map(job => (
        <View key={job.id} style={styles.listItem}>
          <Text style={styles.listTitle}>{job.title}</Text>
          <Text style={styles.listSub}>{job.client} • {job.status}</Text>
        </View>
      ))}
      {/* Recent Users */}
      <Text style={styles.sectionTitle}>Recent Users</Text>
      {recentUsers.map(user => (
        <View key={user.id} style={styles.listItem}>
          <Text style={styles.listTitle}>{user.name}</Text>
          <Text style={styles.listSub}>{user.role}</Text>
        </View>
      ))}
      {/* Recent Reviews */}
      <Text style={styles.sectionTitle}>Recent Reviews</Text>
      {recentReviews.map(r => (
        <View key={r.id} style={styles.listItem}>
          <Text style={styles.listTitle}>{r.reviewer} → {r.target}</Text>
          <Text style={styles.listSub}>⭐ {r.rating} — {r.text}</Text>
        </View>
      ))}
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  metricCard: {
    backgroundColor: '#e0f7f5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
  },
  metricLabel: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#008080', marginTop: 18, marginBottom: 6 },
  listItem: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10, marginBottom: 6 },
  listTitle: { fontWeight: 'bold', color: '#222' },
  listSub: { color: '#555', fontSize: 14 },
});
