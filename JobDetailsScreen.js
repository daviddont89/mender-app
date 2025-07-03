import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import moment from 'moment';

export default function JobDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params;

  const [job, setJob] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, 'jobs', jobId);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        setJob({ id: jobSnap.id, ...jobSnap.data() });
      }
    };

    const fetchUser = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCurrentUser(userSnap.data());
        setRole(userSnap.data().role);
      }
    };

    fetchJob();
    fetchUser();
  }, [jobId]);

  const updateJobStatus = async (statusUpdate) => {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { status: statusUpdate });

    const updatedJob = { ...job, status: statusUpdate };
    setJob(updatedJob);
  };

  const handleIncomplete = () => {
    Alert.prompt(
      'Reason for Incompletion',
      'Please explain why the job was not completed:',
      async (reason) => {
        if (reason) {
          const jobRef = doc(db, 'jobs', jobId);
          await updateDoc(jobRef, {
            status: 'Incomplete',
            incompleteReason: reason,
          });
          setJob({ ...job, status: 'Incomplete', incompleteReason: reason });
        }
      }
    );
  };

  const renderJobMedia = () => {
    return (
      <View style={styles.mediaContainer}>
        {job?.images?.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
        {/* Add logic for videos/files in later version if needed */}
      </View>
    );
  };

  const renderContactInfo = () => {
    if (
      role === 'admin' ||
      (role === 'contractor' && job.contractorId === auth.currentUser.uid)
    ) {
      return (
        <View style={styles.section}>
          <Text style={styles.label}>Client Name:</Text>
          <Text>{job.clientName}</Text>
          <Text style={styles.label}>Phone:</Text>
          <Text>{job.phone}</Text>
          <Text style={styles.label}>Full Address:</Text>
          <Text>{job.address}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <Text style={styles.label}>Location:</Text>
          <Text>{job.city}, {job.zip}</Text>
        </View>
      );
    }
  };

  const renderButtons = () => {
    if (!job || !role) return null;

    const isOwnJob = job.contractorId === auth.currentUser.uid;

    if (role === 'contractor') {
      if (!job.contractorId) {
        return <Button title="Accept Job" onPress={() => updateDoc(doc(db, 'jobs', jobId), { contractorId: auth.currentUser.uid, status: 'Accepted' }).then(() => setJob({ ...job, contractorId: auth.currentUser.uid, status: 'Accepted' }))} />;
      } else if (isOwnJob && job.status === 'Accepted') {
        return <Button title="Start Job" onPress={() => updateJobStatus('In Progress')} />;
      } else if (isOwnJob && job.status === 'In Progress') {
        return (
          <>
            <Button title="Complete Job" onPress={() => updateJobStatus('Completed')} />
            <Button title="Mark Incomplete" color="red" onPress={handleIncomplete} />
          </>
        );
      }
    }

    if (role === 'client') {
      return (
        <>
          <Button title="Edit Job" onPress={() => navigation.navigate('PostJobScreen', { jobId })} />
          <Button title="Cancel Job" color="red" onPress={() => updateJobStatus('Cancelled')} />
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <Button title="Accept" onPress={() => updateJobStatus('Accepted')} />
          <Button title="Start" onPress={() => updateJobStatus('In Progress')} />
          <Button title="Complete" onPress={() => updateJobStatus('Completed')} />
          <Button title="Cancel" onPress={() => updateJobStatus('Cancelled')} />
          <Button title="Mark Incomplete" color="red" onPress={handleIncomplete} />
        </>
      );
    }

    return null;
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.status}>Status: {job.status}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text>{job.description}</Text>
      </View>

      {renderContactInfo()}

      {job.specialInstructions && (
        <View style={styles.section}>
          <Text style={styles.label}>Special Instructions:</Text>
          <Text>{job.specialInstructions}</Text>
        </View>
      )}

      {renderJobMedia()}

      <View style={styles.buttonContainer}>
        {renderButtons()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    marginVertical: 10,
    fontStyle: 'italic',
  },
  section: {
    marginVertical: 10,
  },
  label: {
    fontWeight: '600',
  },
  image: {
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  mediaContainer: {
    flexDirection: 'column',
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
