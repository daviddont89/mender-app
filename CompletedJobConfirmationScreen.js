// CompletedJobConfirmationScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Button, Image, Alert, TextInput, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, storage } from './firebase';
import { doc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CompletedJobConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { job, invoiceItems, dumpFee, notes, elapsed } = route.params;

  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      return Alert.alert('Photo Required', 'Please upload a completed job photo.');
    }

    setUploading(true);

    try {
      // Upload image
      const filename = `completedPhotos/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      const img = await fetch(photoUri);
      const blob = await img.blob();
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);

      // Mark job complete
      await updateDoc(doc(db, 'jobs', job.id), {
        status: 'Completed',
        completedAt: Timestamp.now(),
        completedPhoto: imageURL,
      });

      // Create invoice
      const total = invoiceItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const dumpTotal = dumpFee ? parseFloat(dumpFee) + 25 : 0;
      const grandTotal = total + dumpTotal;
      const contractorPay = parseFloat(((grandTotal * 0.6)).toFixed(2));

      await addDoc(collection(db, 'invoices'), {
        jobId: job.id,
        clientId: job.clientId,
        contractorId: job.contractorId,
        items: invoiceItems,
        dumpFee: parseFloat(dumpFee || 0),
        total: grandTotal,
        contractorPay,
        createdAt: Timestamp.now(),
        status: 'pending',
        notes,
        workDurationMinutes: Math.floor(elapsed / 60000),
      });

      Alert.alert('Success', 'Job marked complete and invoice submitted.');
      navigation.navigate('ContractorHomeScreen');
    } catch (e) {
      console.error('Submit error:', e);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Confirm Completion</Text>

      {/* Completed Photo Upload */}
      <Text style={styles.label}>Upload Completed Job Photo</Text>
      <Button title="Pick Image" onPress={pickImage} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} />}

      {/* Invoice Review */}
      <Text style={styles.label}>Invoice Items</Text>
      {invoiceItems.map((item, idx) => (
        <Text key={idx} style={styles.invoiceItem}>
          {item.label}: ${parseFloat(item.amount).toFixed(2)}
        </Text>
      ))}
      {dumpFee && (
        <Text style={styles.invoiceItem}>Dump Fee: ${parseFloat(dumpFee).toFixed(2)} + $25 flat fee</Text>
      )}

      <Text style={styles.label}>Your Notes</Text>
      <Text style={styles.notes}>{notes || 'None'}</Text>

      <Text style={styles.total}>Total Charged: ${(
        invoiceItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) +
        (dumpFee ? parseFloat(dumpFee) + 25 : 0)
      ).toFixed(2)}</Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Confirm & Submit" onPress={handleSubmit} disabled={uploading} />
        <View style={{ height: 10 }} />
        <Button title="Go Back" color="#999" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  label: { fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  photoPreview: { width: '100%', height: 200, borderRadius: 8, marginVertical: 10 },
  invoiceItem: { fontSize: 16, marginBottom: 4 },
  notes: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    color: '#444',
    fontSize: 15,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 24,
    textAlign: 'center',
    color: '#444',
  },
});
