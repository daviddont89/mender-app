import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, Image
} from 'react-native';
import { db, storage } from './firebase';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPackageBuilderScreen() {
  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [season, setSeason] = useState(getDefaultSeason());
  const [tier, setTier] = useState('Essentials');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [services, setServices] = useState(['']);
  const [contractorPriority, setContractorPriority] = useState([]);
  const [contractorIdInput, setContractorIdInput] = useState('');
  const [contractorRankInput, setContractorRankInput] = useState('');
  const [active, setActive] = useState(true);
  const [logoUri, setLogoUri] = useState(null);
  const [editingId, setEditingId] = useState(null);

  function getDefaultSeason() {
    const month = new Date().getMonth();
    if ([11, 0, 1].includes(month)) return 'Winter';
    if ([2, 3, 4].includes(month)) return 'Spring';
    if ([5, 6, 7].includes(month)) return 'Summer';
    return 'Fall';
  }

  const fetchPackages = async () => {
    const snapshot = await getDocs(collection(db, 'servicePackages'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPackages(data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title || !desc || !price || services.length === 0) {
      return Alert.alert('Missing Info', 'Fill out all required fields');
    }

    let logoURL = null;
    if (logoUri) {
      const filename = `packages/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      const img = await fetch(logoUri);
      const blob = await img.blob();
      await uploadBytes(storageRef, blob);
      logoURL = await getDownloadURL(storageRef);
    }

    const pkgData = {
      title,
      description: desc,
      price: parseFloat(price),
      season,
      tier,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      services: services.filter(s => s),
      contractorPriority,
      active,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      logoURL,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'servicePackages', editingId), pkgData);
        Alert.alert('Updated', 'Package updated');
      } else {
        await addDoc(collection(db, 'servicePackages'), pkgData);
        Alert.alert('Created', 'Package created');
      }
      resetForm();
      fetchPackages();
    } catch (err) {
      Alert.alert('Error', 'Failed to save package');
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setPrice('');
    setSeason(getDefaultSeason());
    setTier('Essentials');
    setStartDate(new Date());
    setEndDate(new Date());
    setServices(['']);
    setContractorPriority([]);
    setContractorIdInput('');
    setContractorRankInput('');
    setLogoUri(null);
    setEditingId(null);
    setActive(true);
  };

  const editPackage = (pkg) => {
    setTitle(pkg.title);
    setDesc(pkg.description);
    setPrice(pkg.price.toString());
    setSeason(pkg.season);
    setTier(pkg.tier || 'Essentials');
    setStartDate(pkg.startDate?.toDate?.() || new Date());
    setEndDate(pkg.endDate?.toDate?.() || new Date());
    setServices(pkg.services || ['']);
    setContractorPriority(pkg.contractorPriority || []);
    setLogoUri(pkg.logoURL || null);
    setActive(pkg.active);
    setEditingId(pkg.id);
  };

  const deletePackage = async (id) => {
    Alert.alert('Delete Package?', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'servicePackages', id));
          fetchPackages();
        },
      },
    ]);
  };

  const addPriorityEntry = () => {
    if (!contractorIdInput || !contractorRankInput) return;
    const rank = parseInt(contractorRankInput);
    if (isNaN(rank)) return Alert.alert('Invalid Rank', 'Enter a number for rank.');
    setContractorPriority(prev => [...prev, { contractorId: contractorIdInput, rank }]);
    setContractorIdInput('');
    setContractorRankInput('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {editingId ? 'Edit Package' : 'Create New Package'}
      </Text>

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={desc} onChangeText={setDesc} multiline />
      <TextInput style={styles.input} placeholder="Price (USD)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Season" value={season} onChangeText={setSeason} />

      <Text style={styles.label}>Tier:</Text>
      <View style={styles.switchRow}>
        {['Essentials', 'Deluxe', 'Premium'].map(opt => (
          <TouchableOpacity key={opt} onPress={() => setTier(opt)} style={{ marginRight: 10 }}>
            <Text style={{ color: tier === opt ? '#008080' : '#888' }}>
              {tier === opt ? '●' : '○'} {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Start Date:</Text>
      <DateTimePicker value={startDate} mode="date" display="default" onChange={(e, date) => setStartDate(date || startDate)} />
      <Text style={styles.label}>End Date:</Text>
      <DateTimePicker value={endDate} mode="date" display="default" onChange={(e, date) => setEndDate(date || endDate)} />

      <Text style={styles.label}>Services Included:</Text>
      {services.map((service, idx) => (
        <TextInput
          key={idx}
          style={styles.input}
          placeholder={`Service ${idx + 1}`}
          value={service}
          onChangeText={(val) => {
            const newServices = [...services];
            newServices[idx] = val;
            setServices(newServices);
          }}
        />
      ))}
      <Button title="Add Another Service" onPress={() => setServices([...services, ''])} />

      <Text style={styles.label}>Contractor Priority List:</Text>
      <TextInput
        style={styles.input}
        placeholder="Contractor ID"
        value={contractorIdInput}
        onChangeText={setContractorIdInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Rank (1 = top priority)"
        keyboardType="numeric"
        value={contractorRankInput}
        onChangeText={setContractorRankInput}
      />
      <Button title="Add Contractor Priority" onPress={addPriorityEntry} />

      {contractorPriority.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Assigned Priority:</Text>
          {contractorPriority.map((c, i) => (
            <Text key={i}>#{c.rank} – {c.contractorId}</Text>
          ))}
        </View>
      )}

      <Button title="Pick Logo Image" onPress={pickLogo} />
      {logoUri && <Image source={{ uri: logoUri }} style={styles.logoPreview} />}

      <View style={styles.switchRow}>
        <Text style={styles.label}>Active:</Text>
        <TouchableOpacity onPress={() => setActive(!active)}>
          <Text style={styles.toggle}>{active ? '✅ Active' : '❌ Inactive'}</Text>
        </TouchableOpacity>
      </View>

      <Button title={editingId ? 'Update Package' : 'Create Package'} onPress={handleSave} />

      <Text style={[styles.heading, { marginTop: 30 }]}>Existing Packages</Text>
      {packages.map(pkg => (
        <View key={pkg.id} style={styles.pkgCard}>
          <Text style={styles.pkgTitle}>{pkg.title} - ${pkg.price}</Text>
          <Text>{pkg.description}</Text>
          <Text>Season: {pkg.season} | Tier: {pkg.tier}</Text>
          <Text>Dates: {pkg.startDate?.toDate?.().toLocaleDateString()} → {pkg.endDate?.toDate?.().toLocaleDateString()}</Text>
          <Text>Services: {pkg.services?.join(', ')}</Text>
          <Text>Active: {pkg.active ? 'Yes' : 'No'}</Text>
          {pkg.contractorPriority?.length > 0 && (
            <Text>Priority List: {pkg.contractorPriority.map(p => `#${p.rank}:${p.contractorId}`).join(', ')}</Text>
          )}
          <View style={styles.cardButtons}>
            <Button title="Edit" onPress={() => editPackage(pkg)} />
            <Button title="Delete" color="red" onPress={() => deletePackage(pkg.id)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginVertical: 16, color: '#008080' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12,
  },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  logoPreview: { width: '100%', height: 140, marginTop: 10, borderRadius: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  toggle: { fontSize: 16, marginLeft: 10 },
  pkgCard: {
    borderWidth: 1, borderColor: '#ccc', padding: 12,
    borderRadius: 8, marginBottom: 12, backgroundColor: '#f9f9f9',
  },
  pkgTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
