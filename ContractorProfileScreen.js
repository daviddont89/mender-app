// ContractorProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export default function ContractorProfileScreen() {
  const navigation = useNavigation();

  const [profile] = useState({
    businessName: 'Handy Pros LLC',
    personalName: 'John Doe',
    license: 'LIC123456',
    bio: 'Specializing in home repairs, remodels, and seasonal maintenance. 10+ years experience.',
    profilePhoto: require('./assets/avatar.png'),
    gallery: [require('./assets/fence1.png'), require('./assets/fence2.png')],
    rating: 4.8,
    specialties: ['Remodels', 'Decks', 'Gutter Cleaning'],
  });

  const handleEdit = () => {
    // Future: navigate to editable profile screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Image source={profile.profilePhoto} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 10, alignSelf: 'center' }} />
      <Text style={styles.label}>Business: {profile.businessName}</Text>
      <Text style={styles.label}>Name: {profile.personalName}</Text>
      <Text style={styles.label}>License: {profile.license}</Text>
      <Text style={styles.label}>Rating: {profile.rating} ⭐</Text>
      <Text style={styles.label}>Specialties: {profile.specialties.join(', ')}</Text>
      <Text style={styles.label}>Experience: 5 years</Text>
      <Text style={styles.label}>Bio: {profile.bio}</Text>
      <Text style={styles.label}>Gallery:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {profile.gallery.map((img, idx) => (
          <Image key={idx} source={img} style={{ width: 90, height: 60, borderRadius: 8, marginRight: 8 }} />
        ))}
      </ScrollView>
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditContractorProfileScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
});
