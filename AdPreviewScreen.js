import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export default function AdPreviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { blurb, image, budget } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const weeks = Math.floor(budget / 5);

  const submitAd = async () => {
    setSubmitting(true);
    try {
      const userId = auth.currentUser.uid;
      const timestamp = Date.now();
      const imageRef = ref(storage, `ads/${userId}/${timestamp}.jpg`);

      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await setDoc(doc(db, 'contractorAds', `${userId}_${timestamp}`), {
        contractorId: userId,
        blurb,
        imageURL: downloadURL,
        budget,
        weeksVisible: weeks,
        createdAt: new Date().toISOString(),
        approved: false,
      });

      Alert.alert('Success', 'Ad submitted and pending approval.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit ad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Your Ad</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.label}>Blurb:</Text>
      <Text style={styles.text}>{blurb}</Text>

      <Text style={styles.label}>Budget:</Text>
      <Text style={styles.text}>${budget} = {weeks} weeks visible</Text>

      <View style={styles.buttons}>
        <Button title="Submit Ad" onPress={submitAd} color="#008080" disabled={submitting} />
        <Button title="Edit" onPress={() => navigation.goBack()} color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
  label: { fontWeight: 'bold', marginTop: 10 },
  text: { marginBottom: 8 },
  buttons: { marginTop: 20 },
});
