// ClientHomeScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebase';

const ClientHomeScreen = () => {
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

  const handleDrawerToggle = () => {
    navigation.openDrawer();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDrawerToggle}>
          <Image source={require('./Icons/Icon.png')} style={styles.logoIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome to Mender</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Posted Jobs</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : userJobs.length === 0 ? (
        <Text style={styles.noJobsText}>You haven't posted any jobs yet.</Text>
      ) : (
        <FlatList
          data={userJobs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#222',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  noJobsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  jobList: {
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#e7f6f2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default ClientHomeScreen;
