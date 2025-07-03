import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
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
  const [timerStart, setTimerStart] = useState(null);

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
        setRole(userSnap.data().role); // 'contractor', 'client', or 'admin'
      }
    };

    fetchJob();
    fetchUser();
  }, [jobId]);

  const updateJobStatus = async (statusUpdate) => {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { status: statusUpdate });

    if (statusUpdate === 'In Progress') {
      setTimerStart(new Date());
    }

    const updatedSnap = await getDoc(jobRef);
    setJob({ id: updatedSnap.id, ...updatedSnap.data() });
  };

  const acceptJob = async () => {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      status: 'Accepted',
      contractorId: auth.currentUser.uid,
    });

    const updatedSnap = await getDoc(jobRef);
    setJob({ id: updatedSnap.id, ...updatedSnap.data() });
  };

  const renderButtons = () => {
    if (!role || !job) return null;

    if (role === 'contractor') {
      if (job.status === 'Open') {
        return <Button title="Accept Job" onPress={acceptJob} />;
      }

      if (job.contractorId === auth.currentUser.uid) {
        return (
          <>
            {job.status === 'Accepted' && (
              <Button title="Start Job" onPress={() => updateJobStatus('In Progress')} />
            )}
            {job.status === 'In Progress' && (
              <>
                <Button title="Complete Job" onPress={() => updateJobStatus('Completed')} />
                <Button title="Incomplete Job" onPress={() => updateJobStatus('Incomplete')} />
              </>
            )}
          </>
        );
      }
    }

    if (role === 'client') {
      return (
        <>
          <Button title="Edit Job" onPress={() => navigation.navigate('EditJob', { jobId })} />
          <Button title="Cancel Job" onPress={() => updateJobStatus('Cancelled')} />
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <Button title="Mark Open" onPress={() => updateJobStatus('Open')} />
          <Button title="Mark Accepted" onPress={() => updateJobStatus('Accepted')} />
          <Button title="Mark In Progress" onPress={() => updateJobStatus('In Progress')} />
          <Button title="Mark Completed" onPress={() => updateJobStatus('Completed')} />
        </>
      );
    }

    return null;
  };

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.text}>{job.description}</Text>
      <Text style={styles.text}>Location: {job.city}, {job.zip}</Text>
      <Text style={styles.text}>Status: {job.status}</Text>
      {job.photos?.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      {timerStart && (
        <Text style={styles.text}>
          Timer Started: {moment(timerStart).format('hh:mm A')}
        </Text>
      )}
      {renderButtons()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 8,
    borderRadius: 10,
  },
});
