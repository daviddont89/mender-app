// 👇 FULL updated ClientHomeScreen.js with Featured Pro section

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Share
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { db } from './firebase';

export default function ClientHomeScreen() {
  const [recentJob, setRecentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredAd, setFeaturedAd] = useState(null);
  const user = getAuth().currentUser;
  const navigation = useNavigation();

  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return '';
    const now = new Date();
    const time = new Date(timestamp.seconds * 1000);
    const diff = Math.floor((now - time) / 60000); // minutes

    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  useEffect(() => {
    const fetchLatestJob = async () => {
      try {
        if (user) {
          const q = query(collection(db, 'jobs'), where('clientId', '==', user.uid));
          const snapshot = await getDocs(q);
          const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const sorted = jobs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
          setRecentJob(sorted[0]);
        }
      } catch (e) {
        console.error('Failed to fetch recent job:', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedAd = async () => {
      try {
        const q = query(collection(db, 'contractorAds'), where('approved', '==', true));
        const snapshot = await getDocs(q);
        const ads = snapshot.docs.map(doc => doc.data());
        if (ads.length > 0) {
          const randomAd = ads[Math.floor(Math.random() * ads.length)];
          setFeaturedAd(randomAd);
        }
      } catch (e) {
        console.error('Failed to fetch ads:', e);
      }
    };

    fetchLatestJob();
    fetchFeaturedAd();
  }, []);

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const shareInvite = async () => {
    try {
      await Share.share({
        message: `Join me on Mender and get fast help for home repairs. Use my referral link!`,
      });
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer}>
            <Text style={styles.menu}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Home</Text>
        </View>

        {/* Profile */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.photoURL || 'https://i.imgur.com/6VBx3io.png' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || 'Client'}</Text>
        </View>

        {/* Active Job */}
        {recentJob ? (
          <View style={styles.jobCard}>
            <Text style={styles.sectionLabel}>My Active Jobs</Text>
            <Text style={styles.jobTitle}>{recentJob.title}</Text>
            <Text style={styles.jobStatus}>{recentJob.status || 'Open'}</Text>
            <Text style={styles.jobActivity}>Last updated {formatTimeAgo(recentJob.updatedAt || recentJob.createdAt)}</Text>

            <TouchableOpacity
              style={styles.jobButton}
              onPress={() => navigation.navigate('JobDetailsScreen', { jobId: recentJob.id })}
            >
              <Text style={styles.jobButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ) : !loading && (
          <Text style={styles.noJobs}>You have no active jobs.</Text>
        )}

        {/* Promo */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>☀️ Summer Deck Repair Season</Text>
          <Text style={styles.promoSub}>Book Now and Save $50!</Text>
        </View>

        {/* Featured Pro */}
        {featuredAd && (
          <View style={styles.adCard}>
            <Text style={styles.sectionLabel}>🔥 Featured Pro</Text>
            <Image source={{ uri: featuredAd.imageURL }} style={styles.adImage} />
            <Text style={styles.adBlurb}>{featuredAd.blurb}</Text>
            <TouchableOpacity style={styles.jobButton}>
              <Text style={styles.jobButtonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Job Inspiration */}
        <Text style={styles.sectionLabel}>Job Inspiration</Text>
        <View style={styles.inspirationRow}>
          <Image source={require('./Icons/fence1.png')} style={styles.inspoImage} />
          <Image source={require('./Icons/fence2.png')} style={styles.inspoImage} />
        </View>

        {/* Progress Tracker */}
        <TouchableOpacity
          style={styles.trackerCard}
          onPress={() => navigation.navigate('JobDetailsScreen', { jobId: recentJob?.id })}
        >
          <Text style={styles.trackerTitle}>📸 Progress Tracker</Text>
          <Text style={styles.trackerText}>Upload Job Photos</Text>
        </TouchableOpacity>

        {/* Stats & Messages */}
        <View style={styles.dashboardRow}>
          <View style={styles.dashboardBox}>
            <Text style={styles.dashboardTitle}>Client Dashboard</Text>
            <Text style={styles.metric}>7</Text>
            <Text style={styles.label}>jobs</Text>
            <Text style={styles.metric}>4.8⭐</Text>
            <Text style={styles.label}>avg rating</Text>
            <Text style={styles.metric}>3.2</Text>
            <Text style={styles.label}>hrs saved</Text>
          </View>
          <View style={styles.dashboardBox}>
            <Text style={styles.dashboardTitle}>Messages</Text>
            <Text>You have 1 new message</Text>
            <TouchableOpacity style={styles.jobButton}>
              <Text style={styles.jobButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral */}
        <TouchableOpacity style={styles.referralCard} onPress={shareInvite}>
          <Text style={styles.referralText}>🎁 Refer a Friend, Earn $25</Text>
          <Text style={styles.referralSub}>Share Invite</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  menu: { fontSize: 26, marginRight: 12 },
  title: { fontSize: 24, fontWeight: '600' },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    backgroundColor: '#f4f4f4', padding: 12, borderRadius: 10,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  sectionLabel: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  jobCard: { backgroundColor: '#eee', padding: 16, borderRadius: 10, marginBottom: 20 },
  jobTitle: { fontSize: 18, fontWeight: 'bold' },
  jobStatus: { color: 'green', fontWeight: '600', marginTop: 4 },
  jobActivity: { fontSize: 12, color: '#666', marginVertical: 4 },
  jobButton: {
    marginTop: 10, backgroundColor: '#008080', padding: 10, borderRadius: 8, alignItems: 'center',
  },
  jobButtonText: { color: '#fff', fontWeight: '600' },
  noJobs: { textAlign: 'center', marginVertical: 20, fontStyle: 'italic' },
  promoBanner: {
    backgroundColor: '#FFA500', padding: 16, borderRadius: 10, marginBottom: 20,
  },
  promoText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  promoSub: { color: '#fff', fontSize: 14 },

  adCard: {
    backgroundColor: '#fff8e1',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#ffd54f',
    borderWidth: 1,
  },
  adImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  adBlurb: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },

  inspirationRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inspoImage: { width: '48%', height: 120, borderRadius: 8 },
  trackerCard: {
    backgroundColor: '#e0f7fa', padding: 16, borderRadius: 10, marginBottom: 20,
  },
  trackerTitle: { fontSize: 18, fontWeight: 'bold' },
  trackerText: { color: '#555' },
  dashboardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dashboardBox: {
    backgroundColor: '#f4f4f4', padding: 12, borderRadius: 10, width: '48%',
  },
  dashboardTitle: { fontWeight: 'bold', marginBottom: 8 },
  metric: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12, color: '#666' },
  referralCard: {
    backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center',
  },
  referralText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  referralSub: { color: '#fff' },
});
