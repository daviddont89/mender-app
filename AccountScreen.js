import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const initialUser = {
  name: 'Jane Client',
  email: 'jane.client@email.com',
  profilePhoto: null,
};

export default function AccountScreen() {
  const [user, setUser] = useState(initialUser);

  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setUser({ ...user, profilePhoto: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Account</Text>
      <TouchableOpacity onPress={pickProfilePhoto}>
        <Image
          source={user.profilePhoto ? { uri: user.profilePhoto } : require('./assets/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.editPhoto}>Edit Photo</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={v => setUser({ ...user, name: v })}
        placeholder="Full Name"
      />
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.positive}>Welcome to Mender! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 18 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10, backgroundColor: '#eee' },
  editPhoto: { color: '#008080', fontSize: 13, marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, fontSize: 16, width: 220, textAlign: 'center',
  },
  email: { color: '#888', fontSize: 15, marginBottom: 10 },
  positive: { marginTop: 18, color: '#008080', fontWeight: 'bold', fontSize: 15 },
});
