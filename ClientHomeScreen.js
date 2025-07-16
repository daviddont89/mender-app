import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [messages, setMessages] = useState(1); // Dummy value for now
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    fetchClientJobs();
  }, []);

  const fetchClientJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('clientId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const jobList = [];
      querySnapshot.forEach((doc) => {
        jobList.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const activeJob = jobs.find((job) => job.status !== 'Completed');

  return (
    <ScrollView style={styles.container}>
      {/* Profile */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            try {
              navigation.dispatch(DrawerActions.openDrawer());
            } catch (e) {
              console.warn('Drawer not available:', e.message);
            }
          }}
        >
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileCard}>
          <Image
            source={require('./assets/avatar.png')} // Replace with user's photo
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || 'Client'}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Active Job */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Active Jobs</Text>
        {activeJob ? (
          <View style={styles.card}>
            <Text style={styles.jobTitle}>{activeJob.title}</Text>
            <Text style={styles.jobStatus}>In Progress</Text>
            <Text style={styles.jobUpdate}>Last activity: {activeJob.lastUpdated || '2h ago'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: activeJob.id })}>
              <Text style={styles.link}>View Details</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.placeholder}>No active jobs</Text>
        )}
      </View>

      {/* Promo Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🌞 Summer Deck Repair Season</Text>
        <Text style={styles.bannerSub}>Book Now and Save $50!</Text>
      </View>

      {/* Job Inspiration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Inspiration</Text>
        <View style={styles.inspirationRow}>
          <Image source={require('./assets/fence1.png')} style={styles.inspirationImage} />
          <Image source={require('./assets/fence2.png')} style={styles.inspirationImage} />
        </View>
      </View>

      {/* Progress Tracker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Progress Tracker</Text>
        <Text style={styles.subtext}>Upload Job Photos</Text>
      </View>

      {/* Dashboard and Messages */}
      <View style={styles.row}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Client Dashboard</Text>
          <Text style={styles.metricItem}>7 jobs posted</Text>
          <Text style={styles.metricItem}>4.8 avg rating</Text>
          <Text style={styles.metricItem}>3.2d saved</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Messages</Text>
          <Text style={styles.metricItem}>You have {messages} new message</Text>
          <TouchableOpacity style={styles.linkBox}>
            <Text style={styles.link}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Referral */}
      <View style={styles.referral}>
        <Text style={styles.referralText}>🎁 Refer a Friend, Earn $25</Text>
        <TouchableOpacity>
          <Text style={styles.referralLink}>Share Invite</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  profileCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#555',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobStatus: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  jobUpdate: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  link: {
    color: '#0084ff',
    marginTop: 8,
  },
  linkBox: {
    marginTop: 10,
    padding: 6,
    backgroundColor: '#e6f0ff',
    borderRadius: 5,
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
  },
  banner: {
    backgroundColor: '#ffa733',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  bannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  bannerSub: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  inspirationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inspirationImage: {
    width: '48%',
    height: 100,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  metricTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  metricItem: {
    fontSize: 12,
    color: '#444',
  },
  referral: {
    backgroundColor: '#d9fdd3',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  referralText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  referralLink: {
    color: '#008000',
    fontSize: 14,
  },
});
