// FeaturedProModal.js
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

const FeaturedProModal = ({ visible, onClose }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      fetchRandomAd();
    }
  }, [visible]);

  const fetchRandomAd = async () => {
    try {
      const adsRef = collection(db, 'ads');
      const q = query(
        adsRef,
        where('approved', '==', true),
        where('expirationDate', '>', new Date())
      );
      const querySnapshot = await getDocs(q);
      const ads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (ads.length > 0) {
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        setAd(randomAd);
      } else {
        setAd(null);
      }
    } catch (error) {
      console.error('Error fetching featured ad:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || loading) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {ad ? (
            <>
              <Text style={styles.title}>🌟 Featured Pro</Text>
              <Image source={{ uri: ad.imageUrl }} style={styles.image} />
              <Text style={styles.blurb}>{ad.blurb}</Text>
              <Text style={styles.budget}>Budget: ${ad.budget}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onClose();
                  navigation.navigate('ClientSubscriptionScreen');
                }}
              >
                <Text style={styles.buttonText}>View Seasonal Packages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noAd}>No featured pro available right now.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    width: '85%',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  blurb: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  budget: {
    fontSize: 14,
    color: '#008080',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  closeBtn: {
    padding: 5,
  },
  closeText: {
    color: '#666',
    fontFamily: 'Quicksand-Regular',
  },
  noAd: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
  },
});

export default FeaturedProModal;
