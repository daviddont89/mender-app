import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ScrollView,
} from 'react-native';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();
  if ([11, 0, 1].includes(month)) return 'Winter';
  if ([2, 3, 4].includes(month)) return 'Spring';
  if ([5, 6, 7].includes(month)) return 'Summer';
  return 'Fall';
}

export default function ClientSubscriptionScreen() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(getCurrentSeason());
  const navigation = useNavigation();

  const fetchPackages = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'servicePackages'));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(pkg => pkg.active);
      // Only show packages for the current season and within their date range
      const now = new Date();
      const filtered = data.filter(pkg => {
        if (pkg.season !== season) return false;
        if (pkg.startDate && pkg.endDate) {
          const start = pkg.startDate.toDate ? pkg.startDate.toDate() : new Date(pkg.startDate);
          const end = pkg.endDate.toDate ? pkg.endDate.toDate() : new Date(pkg.endDate);
          return now >= start && now <= end;
        }
        return true;
      });
      setPackages(filtered);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // Add faux/test packages for demo if empty
    if (packages.length === 0) {
      setPackages([
        { id: 'pkg1', title: 'Spring Essentials', price: 199, description: 'Essential spring maintenance.', services: ['Gutter cleaning', 'Lawn fertilization'], active: true, logoURL: null },
        { id: 'pkg2', title: 'Summer Deluxe', price: 299, description: 'Deluxe summer care.', services: ['Deck sealing', 'Pest inspection'], active: true, logoURL: null },
        { id: 'pkg3', title: 'Fall Premium', price: 399, description: 'Complete fall protection.', services: ['Gutter clean-out', 'Roof clearing'], active: true, logoURL: null },
        { id: 'pkg4', title: 'Winter Comfort', price: 249, description: 'Stay cozy all winter.', services: ['Pipe insulation', 'Smoke detector test'], active: true, logoURL: null },
      ]);
    }
  }, [season]); // Add season to dependency array to refetch when season changes

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
    loading ? (
      <View style={styles.container}><Text>Loading...</Text></View>
    ) : (
      <FlatList
        data={packages}
        keyExtractor={item => item.id}
        renderItem={renderPackageCard}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginBottom: 10, backgroundColor: '#008080', padding: 8, borderRadius: 8 }}
              onPress={() => navigation.navigate('MySubscriptionsScreen')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>My Subscriptions</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Available {season} Packages</Text>
          </>
        }
        contentContainerStyle={styles.container}
      />
    )
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
