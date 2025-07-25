// ApplyContractorScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const demoProfilePic = require('./Icons/avatar.png');

export default function ApplyContractorScreen() {
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.contractor@email.com');
  const [phone, setPhone] = useState('555-123-4567');
  const [skills, setSkills] = useState('Decks, Fencing, Painting');
  const [bio, setBio] = useState('Experienced contractor with 10+ years in home improvement.');
  const [portfolio, setPortfolio] = useState('https://myportfolio.com/janedoe');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setSuccess(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Apply to Become a Contractor</Text>
        <Text style={styles.subheading}>Join Mender and connect with local clients!</Text>
        <View style={styles.avatarBox}>
          <Image source={demoProfilePic} style={styles.avatar} />
          <Text style={styles.avatarLabel}>Profile Photo</Text>
        </View>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your Name" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
        <Text style={styles.label}>Skills / Services</Text>
        <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="e.g. Decks, Fencing" />
        <Text style={styles.label}>Short Bio</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={bio} onChangeText={setBio} placeholder="Tell us about your experience" multiline />
        <Text style={styles.label}>Portfolio Link (optional)</Text>
        <TextInput style={styles.input} value={portfolio} onChangeText={setPortfolio} placeholder="https://" autoCapitalize="none" />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Icon name="check" size={22} color="#fff" />
          <Text style={styles.submitBtnText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={success} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color="#008080" style={{ alignSelf: 'center', marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Application Submitted!</Text>
            <Text style={styles.modalText}>Thank you for applying. Our team will review your application and contact you soon.</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSuccess(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#008080', marginBottom: 4, textAlign: 'center' },
  subheading: { fontSize: 15, color: '#555', marginBottom: 18, textAlign: 'center' },
  avatarBox: { alignItems: 'center', marginBottom: 18 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 6 },
  avatarLabel: { fontSize: 13, color: '#888' },
  label: { fontWeight: 'bold', color: '#222', marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: '#f2f8f7', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 4, borderWidth: 1, borderColor: '#e0f7f5' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#008080', borderRadius: 8, padding: 14, justifyContent: 'center', marginTop: 18 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 24, borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#008080' },
  modalText: { fontSize: 15, color: '#444', marginBottom: 18, textAlign: 'center' },
  closeBtn: { backgroundColor: '#008080', paddingVertical: 10, borderRadius: 6, marginTop: 10, alignItems: 'center', width: 120 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
