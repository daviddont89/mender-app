import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const testContractors = [
  {
    id: '1',
    businessName: 'Handy Pros LLC',
    personalName: 'John Doe',
    license: 'LIC123456',
    profilePhoto: require('./assets/avatar.png'),
    rating: 4.8,
    bio: 'Specializing in home repairs, remodels, and seasonal maintenance. 10+ years experience.',
    gallery: [require('./assets/fence1.png'), require('./assets/fence2.png')],
    video: null,
    specialties: ['Remodels', 'Decks', 'Gutter Cleaning'],
  },
  {
    id: '2',
    businessName: 'All-Season Services',
    personalName: 'Jane Smith',
    license: 'LIC654321',
    profilePhoto: require('./assets/worker.png'),
    rating: 4.9,
    bio: 'From spring cleaning to winterizing, I keep your home in top shape year-round.',
    gallery: [require('./Icons/house-1.png'), require('./Icons/house-2.png')],
    video: null,
    specialties: ['Seasonal Prep', 'Landscaping', 'Roof Care'],
  },
  {
    id: '3',
    businessName: 'ProFix Solutions',
    personalName: 'Carlos Martinez',
    license: 'LIC789012',
    profilePhoto: require('./assets/avatar.png'),
    rating: 4.7,
    bio: 'Licensed, insured, and ready to tackle your toughest jobs. Portfolio available.',
    gallery: [require('./Icons/house-3.png'), require('./Icons/house-4.png')],
    video: null,
    specialties: ['Electrical', 'Plumbing', 'Painting'],
  },
];

export default function ContractorDirectoryScreen() {
  const [contractors] = useState(testContractors);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  const filteredContractors = showOnlyFavorites ? contractors.filter(c => favorites.includes(c.id)) : contractors;

  const renderGallery = (gallery) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
      {gallery.map((img, idx) => (
        <Image key={idx} source={img} style={styles.galleryImg} />
      ))}
    </ScrollView>
  );

  const renderContractor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image source={item.profilePhoto} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.personalName}>{item.personalName}</Text>
          <Text style={styles.license}>License: {item.license}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Icon name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'} size={28} color={favorites.includes(item.id) ? '#e53935' : '#bbb'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.bio}>{item.bio}</Text>
      <Text style={styles.specialties}>Specialties: {item.specialties.join(', ')}</Text>
      {item.gallery && renderGallery(item.gallery)}
      {/* Video support can be added here in the future */}
      <TouchableOpacity style={styles.bookBtn}>
        <Text style={styles.bookBtnText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meet Our Contractors</Text>
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={() => setShowOnlyFavorites(f => !f)}
      >
        <Icon name={showOnlyFavorites ? 'favorite' : 'favorite-border'} size={22} color={showOnlyFavorites ? '#e53935' : '#008080'} />
        <Text style={styles.filterBtnText}>{showOnlyFavorites ? 'Show All' : 'Show Favorites'}</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredContractors}
        keyExtractor={item => item.id}
        renderItem={renderContractor}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No favorites yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 12 },
  card: {
    backgroundColor: '#f4f4f4', borderRadius: 10,
    padding: 16, marginBottom: 20, elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee' },
  businessName: { fontSize: 17, fontWeight: 'bold', color: '#008080' },
  personalName: { fontSize: 15, color: '#222' },
  license: { fontSize: 13, color: '#888' },
  rating: { fontSize: 14, color: '#f9a825', marginTop: 2 },
  bio: { fontSize: 14, color: '#444', marginVertical: 6 },
  specialties: { fontSize: 13, color: '#555', marginBottom: 6 },
  galleryImg: { width: 90, height: 60, borderRadius: 8, marginRight: 8 },
  bookBtn: {
    marginTop: 10, backgroundColor: '#008080',
    padding: 10, borderRadius: 8, alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontWeight: 'bold' },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 10, backgroundColor: '#e0f7f5', padding: 8, borderRadius: 8,
  },
  filterBtnText: { color: '#008080', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
}); 