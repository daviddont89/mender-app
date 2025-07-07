// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// components/JobCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function JobCard({ job }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetails', { job })}
    >
      {job.imageURL ? (
        <Image source={{ uri: job.imageURL }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.details}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{job.description}</Text>
        <Text style={styles.zip}>ZIP: {job.zip || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  details: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#333',
  },
  zip: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
});
