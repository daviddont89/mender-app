import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Share, Modal
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { db } from './firebase';
import Toast from 'react-native-toast-message';

export default function ClientHomeScreen() {
  const [recentJob, setRecentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredAd, setFeaturedAd] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const user = getAuth().currentUser;
  const navigation = useNavigation();

  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return '';
    const now = new Date();
    const time = new Date(timestamp.seconds * 1000);
    const diff = Math.floor((now - time) / 60000);
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

    const timer = setTimeout(() => {
      if (featuredAd) {
        Toast.show({
          type: 'info',
          text1: 'Want to meet our Featured Pro?',
          text2: '',
          position: 'bottom',
          autoHide: false,
          onPress: () => {
            Toast.hide();
            setModalVisible(true);
          },
          props: {
            onYes: () => {
              Toast.hide();
              setModalVisible(true);
            },
            onNo: () => {
              Toast.hide();
            },
          },
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, featuredAd]);

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
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer}>
            <Text style={styles.menu}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Home</Text>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.photoURL || 'https://i.imgur.com/6VBx3io.png' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || 'Client'}</Text>
        </View>

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

        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>☀️ Summer Deck Repair Season</Text>
          <Text style={styles.promoSub}>Book Now and Save $50!</Text>
        </View>

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

        <Text style={styles.sectionLabel}>Job Inspiration</Text>
        <View style={styles.inspirationRow}>
          <Image source={require('./Icons/fence1.png')} style={styles.inspoImage} />
          <Image source={require('./Icons/fence2.png')} style={styles.inspoImage} />
        </View>

        <TouchableOpacity
          style={styles.trackerCard}
          onPress={() => navigation.navigate('JobDetailsScreen', { jobId: recentJob?.id })}
        >
          <Text style={styles.trackerTitle}>📸 Progress Tracker</Text>
          <Text style={styles.trackerText}>Upload Job Photos</Text>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.referralCard} onPress={shareInvite}>
          <Text style={styles.referralText}>🎁 Refer a Friend, Earn $25</Text>
          <Text style={styles.referralSub}>Share Invite</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Featured Pro Pop-up */}
      {featuredAd && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={{
            flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '85%',
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>🌟 Featured Pro</Text>
              <Image source={{ uri: featuredAd.imageURL }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 10 }} />
              <Text style={{ fontSize: 14, marginBottom: 12 }}>{featuredAd.blurb}</Text>
              <TouchableOpacity
                style={styles.jobButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ClientSubscriptionScreen');
                }}
              >
                <Text style={styles.jobButtonText}>View Seasonal Packages</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                <Text style={{ color: '#888', textAlign: 'center' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({/* unchanged from your current version */});
