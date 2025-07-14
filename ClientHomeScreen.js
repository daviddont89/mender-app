// ClientHomeScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { db } from './firebase';

const { width } = Dimensions.get('window');

const TUTORIAL = [
  {
    key: '1',
    title: 'How to Post a Job',
    text: 'Tap the "Post a Job" button and describe your project. Add photos and set urgency.',
    icon: require('./Icons/pencil.png'),
  },
  {
    key: '2',
    title: 'How Invoicing Works',
    text: 'Jobs are billed at $75/hr. You’ll receive a digital invoice after completion.',
    icon: require('./Icons/receiptblueandblack.png'),
  },
  {
    key: '3',
    title: 'Track Your Job',
    text: 'See real-time updates, time logs, and uploaded progress photos from your contractor.',
    icon: require('./Icons/icons8-time-card-30.png'),
  },
  {
    key: '4',
    title: 'Rate Your Contractor',
    text: 'After the job is done, leave a review to help improve quality and transparency.',
    icon: require('./Icons/handshake.png'),
  },
];

export default function ClientHomeScreen() {
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (user) {
          const q = query(collection(db, 'jobs'), where('postedBy', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const jobsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserJobs(jobsData);
        }
      } catch (error) {
        console.error('Error fetching user jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetailsScreen', { jobId: item.id })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  const TutorialSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
          <Text style={styles.drawerText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mender</Text>
      </View>

      {/* Job Feed */}
      <FlatList
        data={userJobs}
        keyExtractor={item => item.id}
        renderItem={renderJobCard}
        ListEmptyComponent={
          !loading && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
            >
              {TUTORIAL.map(item => (
                <TutorialSlide key={item.key} item={item} />
              ))}
            </ScrollView>
          )
        }
        contentContainerStyle={
          userJobs.length === 0 && !loading ? { flexGrow: 1, justifyContent: 'center' } : null
        }
      />

      {/* Post Job Button */}
      <TouchableOpacity
        style={styles.postJobButton}
        onPress={() => navigation.navigate('PostJobScreen')}
      >
        <Text style={styles.postJobText}>Post a Job</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008080',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  drawerButton: {
    marginRight: 16,
  },
  drawerText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  jobCard: {
    backgroundColor: '#f4f4f4',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  jobTitle: {
    fontSize: 18,
    color: '#008080',
    fontWeight: 'bold',
  },
  jobDesc: {
    fontSize: 14,
    color: '#333',
  },
  postJobButton: {
    backgroundColor: '#008080',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  postJobText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carousel: {
    flexGrow: 0,
  },
  slide: {
    width,
    padding: 25,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginVertical: 10,
    textAlign: 'center',
  },
  slideText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  icon: {
    width: width * 0.6,
    height: 180,
    marginBottom: 10,
  },
});
