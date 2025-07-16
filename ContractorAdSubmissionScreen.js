import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function ContractorAdSubmissionScreen() {
  const [blurb, setBlurb] = useState('');
  const [image, setImage] = useState(null);
  const [budget, setBudget] = useState('');
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const goToPreview = () => {
    if (!blurb || !image || !budget) {
      Alert.alert('Missing Info', 'Please complete all fields');
      return;
    }

    navigation.navigate('AdPreviewScreen', {
      blurb,
      image,
      budget: parseFloat(budget),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Ad</Text>

      <TextInput
        placeholder="Describe your service or specialty..."
        style={styles.input}
        multiline
        numberOfLines={4}
        value={blurb}
        onChangeText={setBlurb}
      />

      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <Button title="Pick Photo" onPress={pickImage} />

      <TextInput
        placeholder="Budget (e.g. 20)"
        keyboardType="numeric"
        style={styles.input}
        value={budget}
        onChangeText={setBudget}
      />

      <Button title="Preview Ad" onPress={goToPreview} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
