import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const initialProfile = {
  businessName: 'Handy Pros LLC',
  personalName: 'John Doe',
  license: 'LIC123456',
  bio: 'Specializing in home repairs, remodels, and seasonal maintenance. 10+ years experience.',
  profilePhoto: null,
  gallery: [],
};

export default function EditContractorProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(initialProfile);

  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setProfile({ ...profile, profilePhoto: result.assets[0].uri });
    }
  };

  const addGalleryImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setProfile({ ...profile, gallery: [...profile.gallery, result.assets[0].uri] });
    }
  };

  const handleSave = () => {
    // For now, just go back. In production, save to Firestore.
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={profile.businessName}
        onChangeText={v => setProfile({ ...profile, businessName: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Personal Name"
        value={profile.personalName}
        onChangeText={v => setProfile({ ...profile, personalName: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="License Number"
        value={profile.license}
        onChangeText={v => setProfile({ ...profile, license: v })}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Short Bio"
        value={profile.bio}
        multiline
        onChangeText={v => setProfile({ ...profile, bio: v })}
      />
      <Text style={styles.label}>Profile Photo:</Text>
      <TouchableOpacity style={styles.photoBtn} onPress={pickProfilePhoto}>
        <Text style={styles.photoBtnText}>Pick Profile Photo</Text>
      </TouchableOpacity>
      {profile.profilePhoto && <Image source={{ uri: profile.profilePhoto }} style={styles.profileImg} />}
      <Text style={styles.label}>Gallery:</Text>
      <TouchableOpacity style={styles.photoBtn} onPress={addGalleryImage}>
        <Text style={styles.photoBtnText}>Add Gallery Image</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {profile.gallery.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.galleryImg} />
        ))}
      </ScrollView>
      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, fontSize: 16,
  },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  photoBtn: {
    backgroundColor: '#008080', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 8,
  },
  photoBtnText: { color: '#fff', fontWeight: 'bold' },
  profileImg: { width: 90, height: 90, borderRadius: 45, marginBottom: 10, alignSelf: 'center' },
  galleryImg: { width: 90, height: 60, borderRadius: 8, marginRight: 8 },
}); 