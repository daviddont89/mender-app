import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ScrollView,
} from 'react-native';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function ClientSubscriptionScreen() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'servicePackages'));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(pkg => pkg.active); // Show only active
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePurchase = async (pkg) => {
    try {
      await addDoc(collection(db, 'clientSubscriptions'), {
        clientId: auth.currentUser.uid,
        packageId: pkg.id,
        title: pkg.title,
        price: pkg.price,
        purchasedAt: Timestamp.now(),
        status: 'active',
      });
      Alert.alert('Success', 'Subscription purchased!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to complete purchase.');
    }
  };

  const renderPackageCard = ({ item }) => (
    <View style={styles.card}>
      {item.logoURL && <Image source={{ uri: item.logoURL }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.servicesLabel}>Includes:</Text>
      {item.services?.map((s, i) => <Text key={i} style={styles.service}>• {s}</Text>)}
      <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item)}>
        <Text style={styles.buttonText}>Purchase</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Available Packages</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={item => item.id}
          renderItem={renderPackageCard}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 12 },
  card: {
    backgroundColor: '#f4f4f4', borderRadius: 10,
    padding: 16, marginBottom: 20,
  },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: 'green', marginBottom: 4 },
  desc: { marginBottom: 8 },
  servicesLabel: { fontWeight: '600' },
  service: { fontSize: 14, color: '#444' },
  button: {
    marginTop: 10, backgroundColor: '#008080',
    padding: 10, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
