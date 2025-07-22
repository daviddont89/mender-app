// Finalized ClientHomeScreen.js with header, name fallback, inspiration modal, and Material FAB

import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  Modal,
  Dimensions,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const placeholderImg = require('./Icons/house-1.png');
const { width } = Dimensions.get('window');

export default function ClientHomeScreen() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [previousJobs, setPreviousJobs] = useState([]);
  const [featuredAd, setFeaturedAd] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('Client');
  const [expandedJob, setExpandedJob] = useState(null);

  const user = getAuth().currentUser;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Mender Services' });
  }, [navigation]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp?.seconds) return '';
    const now = new Date();
    const time = new Date(timestamp.seconds * 1000);
    const diff = Math.floor((now - time) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserName(
            data.name ||
            data.fullName ||
            data.displayName ||
            user.email?.split('@')[0] ||
            'Client'
          );
        }
      }
    };

    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('clientId', '==', user.uid));
        const snapshot = await getDocs(q);
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = jobs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setActiveJobs(sorted.filter(job => job.status !== 'Completed'));
        setPreviousJobs(sorted.filter(job => job.status === 'Completed'));
      } catch (e) {
        console.error('Error fetching jobs:', e);
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
        console.error('Error fetching featured ad:', e);
      }
    };

    fetchUserName();
    fetchJobs();
    fetchFeaturedAd();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (featuredAd) {
        Toast.show({
          type: 'info',
          text1: 'Want to meet our Featured Pro?',
          position: 'bottom',
          onPress: () => {
            Toast.hide();
            setModalVisible(true);
          },
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [featuredAd]);

  const shareInvite = async () => {
    try {
      await Share.share({
        message: 'Join me on Mender and get fast help for home repairs. Use my referral link!',
      });
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  const mockInspirationJobs = [
    {
      id: '1',
      title: 'Deck Transformation',
      imageBefore: placeholderImg,
      imageAfter: placeholderImg,
      contractor: 'ProDeck Builders',
    },
    {
      id: '2',
      title: 'Fence Rebuild',
      imageBefore: placeholderImg,
      imageAfter: placeholderImg,
      contractor: 'Northwest Woodworks',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Welcome to Mender, {userName}</Text>

        <Text style={styles.sectionTitle}>My Active Jobs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {activeJobs.length === 0 ? (
            <Text style={styles.placeholder}>No active jobs yet.</Text>
          ) : (
            activeJobs.map(job => (
              <TouchableOpacity
                key={job.id}
                style={styles.activeCard}
                onPress={() => navigation.navigate('JobDetailsScreen', { jobId: job.id })}
              >
                <Text style={styles.prevJobTitle}>{job.title}</Text>
                <Text style={styles.statusBadge}>{job.status}</Text>
                <Text style={styles.timestamp}>{formatTimeAgo(job.updatedAt || job.createdAt)}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ClientSubscriptionScreen')}
        >
          <Text style={styles.cardTitle}>☀️ Summer Deck Repair Package</Text>
          <Text style={styles.cardSubtitle}>Save $50 with a subscription</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Job Inspiration</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {mockInspirationJobs.map(job => (
            <TouchableOpacity key={job.id} style={styles.inspoCard} onPress={() => setExpandedJob(job)}>
              <Image source={job.imageAfter} style={styles.inspoImage} />
              <Text style={styles.prevJobTitle}>{job.title}</Text>
              <Text style={styles.cardSubtitle}>by {job.contractor}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {featuredAd && (
          <View style={[styles.card, { backgroundColor: '#e0f7f5' }]}>
            <Text style={styles.cardTitle}>Meet Our Featured Pro?</Text>
            <Text style={styles.cardSubtitle}>Check out this week’s top contractor.</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>View Pro</Text>
            </TouchableOpacity>
          </View>
        )}

        {previousJobs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Previous Jobs</Text>
            {previousJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.prevJobCard}
                onPress={() => navigation.navigate('JobDetailsScreen', { jobId: job.id })}
              >
                <Image
                  source={{ uri: job.coverPhoto || Image.resolveAssetSource(placeholderImg).uri }}
                  style={styles.prevJobImage}
                />
                <View>
                  <Text style={styles.prevJobTitle}>{job.title}</Text>
                  <Text style={styles.prevJobDate}>
                    {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
                  </Text>
                  <Text style={styles.statusBadge}>Completed</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.referralCard} onPress={shareInvite}>
          <Text style={styles.cardTitle}>🎁 Refer a Friend, Earn $25</Text>
          <Text style={styles.cardSubtitle}>Share Invite</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Material Design Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostJobScreen')}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {expandedJob && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { height: '85%' }]}>
              <Image source={expandedJob.imageAfter} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{expandedJob.title}</Text>
              <Text style={styles.modalText}>Contractor: {expandedJob.contractor}</Text>
              <TouchableOpacity style={styles.button} onPress={() => setExpandedJob(null)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {featuredAd && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🌟 Featured Pro</Text>
              <Image source={{ uri: featuredAd.imageURL }} style={styles.modalImage} />
              <Text style={styles.modalText}>{featuredAd.blurb}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ClientSubscriptionScreen');
                }}
              >
                <Text style={styles.buttonText}>View Seasonal Packages</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 100 },
  welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  placeholder: { fontSize: 14, color: '#666', paddingLeft: 10 },
  activeCard: {
    backgroundColor: '#eef6f8',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 180,
  },
  card: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#555' },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  prevJobCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  prevJobImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  prevJobTitle: { fontSize: 16, fontWeight: 'bold' },
  prevJobDate: { fontSize: 13, color: '#777' },
  statusBadge: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#008080',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  referralCard: {
    backgroundColor: '#fffde7',
    padding: 16,
    borderRadius: 10,
    marginBottom: 40,
  },
  inspoCard: {
    backgroundColor: '#f2f8f7',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 180,
  },
  inspoImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#008080',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalText: { fontSize: 14, marginBottom: 12 },
  modalClose: { marginTop: 10, textAlign: 'center', color: '#666' },
});
