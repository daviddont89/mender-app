// Finalized ClientHomeScreen.js with header, name fallback, inspiration modal, and Material FAB

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const placeholderImg = require('./Icons/house-1.png');
const { width } = Dimensions.get('window');

const demoActiveJobs = [
  { id: '1', title: 'Gutter Cleaning', status: 'In Progress', updatedAt: new Date(), coverPhoto: null },
  { id: '2', title: 'Deck Repair', status: 'Open', updatedAt: new Date(), coverPhoto: null },
];
const demoPreviousJobs = [
  { id: '3', title: 'Winterizing', status: 'Completed', updatedAt: new Date(), coverPhoto: null },
];
const demoPackages = [
  { id: 'pkg1', title: 'Summer Deluxe', desc: 'Deluxe summer care for your home.', price: 299 },
  { id: 'pkg2', title: 'Fall Essentials', desc: 'Essential fall maintenance.', price: 199 },
];
const demoInspiration = [
  { id: 'insp1', title: 'Deck Transformation', before: placeholderImg, after: placeholderImg },
  { id: 'insp2', title: 'Fence Rebuild', before: placeholderImg, after: placeholderImg },
];
const seasonalTips = [
  'Clean gutters and downspouts.',
  'Service your HVAC system.',
  'Check roof for winter damage.',
  'Fertilize your lawn and garden.',
];

export default function ClientHomeScreen({ navigation }) {
  const [showReferral, setShowReferral] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [expandedInspo, setExpandedInspo] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Welcome to Mender</Text>
        <Text style={styles.subheading}>Your all-in-one home maintenance partner</Text>

        {/* Packages Section */}
        <Text style={styles.sectionTitle}>Seasonal Packages</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {demoPackages.map(pkg => (
            <View key={pkg.id} style={styles.packageCard}>
              <Text style={styles.packageTitle}>{pkg.title}</Text>
              <Text style={styles.packageDesc}>{pkg.desc}</Text>
              <Text style={styles.packagePrice}>${pkg.price}</Text>
              <TouchableOpacity style={styles.packageBtn} onPress={() => navigation.navigate('ClientSubscriptionScreen')}>
                <Text style={styles.packageBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* My Active Jobs */}
        <Text style={styles.sectionTitle}>My Active Jobs</Text>
        {demoActiveJobs.length === 0 ? (
          <Text style={styles.emptyMsg}>No active jobs yet.</Text>
        ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {demoActiveJobs.map(job => (
              <View key={job.id} style={styles.activeCard}>
                <Text style={styles.activeTitle}>{job.title}</Text>
                <Text style={styles.statusBadge}>{job.status}</Text>
                <Text style={styles.timestamp}>Updated: {job.updatedAt.toLocaleDateString()}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Previous Jobs */}
        <Text style={styles.sectionTitle}>Previous Jobs</Text>
        {demoPreviousJobs.length === 0 ? (
          <Text style={styles.emptyMsg}>No previous jobs yet.</Text>
        ) : (
          demoPreviousJobs.map(job => (
            <View key={job.id} style={styles.prevJobCard}>
              <Image source={job.coverPhoto || placeholderImg} style={styles.prevJobImage} />
              <View>
                <Text style={styles.prevJobTitle}>{job.title}</Text>
                <Text style={styles.statusBadge}>Completed</Text>
                <Text style={styles.timestamp}>Updated: {job.updatedAt.toLocaleDateString()}</Text>
              </View>
            </View>
          ))
        )}

        {/* Inspiration & Tips Section */}
        <Text style={styles.sectionTitle}>Inspiration & Tips</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {demoInspiration.map(job => (
            <TouchableOpacity key={job.id} style={styles.inspoCard} onPress={() => setExpandedInspo(job)}>
              <Image source={job.after} style={styles.inspoImage} />
              <Text style={styles.prevJobTitle}>{job.title}</Text>
              <Text style={styles.cardSubtitle}>Before & After</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>Seasonal Tips</Text>
          {seasonalTips.map((tip, idx) => (
            <Text key={idx} style={styles.tip}>• {tip}</Text>
            ))}
          </View>

        {/* Refer a Friend Button */}
        <TouchableOpacity style={styles.referBtn} onPress={() => setShowReferral(true)}>
          <Icon name="share" size={22} color="#fff" />
          <Text style={styles.referBtnText}>Refer a Friend</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Post a Job Button */}
      <TouchableOpacity style={styles.postJobBtn} onPress={() => navigation.navigate('PostJobScreen')}>
        <Text style={styles.postJobBtnText}>Post a Job</Text>
      </TouchableOpacity>

      {/* Refer a Friend Modal */}
      <Modal visible={showReferral} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}> 
            <Text style={styles.modalTitle}>🎁 Refer a Friend</Text>
            <Text style={{ marginBottom: 10, textAlign: 'center' }}>
              Share this link with a friend and you’ll both get a reward when they sign up!
            </Text>
            <Text selectable style={{ fontWeight: 'bold', marginBottom: 16, color: '#008080' }}>https://menderapp.com/referral/ABC123</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                // Use Share API in real app
              }}
            >
              <Text style={styles.buttonText}>Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowReferral(false)} style={{ marginTop: 10 }}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Inspiration Modal */}
      {expandedInspo && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { height: '85%' }]}>
              <Image source={expandedInspo.after} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{expandedInspo.title}</Text>
              <Text style={styles.modalText}>Before & After</Text>
              <TouchableOpacity style={styles.button} onPress={() => setExpandedInspo(null)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
          </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 120 },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#008080', marginBottom: 4, textAlign: 'center' },
  subheading: { fontSize: 16, color: '#555', marginBottom: 18, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  packageCard: { backgroundColor: '#e0f7f5', padding: 16, borderRadius: 10, marginRight: 14, width: 220 },
  packageTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  packageDesc: { fontSize: 14, color: '#555', marginBottom: 6 },
  packagePrice: { fontSize: 15, color: 'green', marginBottom: 8 },
  packageBtn: { backgroundColor: '#008080', padding: 8, borderRadius: 8, alignItems: 'center' },
  packageBtnText: { color: '#fff', fontWeight: 'bold' },
  activeCard: { backgroundColor: '#eef6f8', padding: 12, borderRadius: 10, marginRight: 10, width: 180 },
  activeTitle: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  statusBadge: { fontSize: 12, color: '#fff', backgroundColor: '#008080', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  timestamp: { fontSize: 12, color: '#888', marginTop: 2 },
  prevJobCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  prevJobImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  prevJobTitle: { fontSize: 16, fontWeight: 'bold' },
  inspoCard: { backgroundColor: '#f2f8f7', padding: 10, borderRadius: 10, marginRight: 10, width: 180 },
  inspoImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  tipsBox: { backgroundColor: '#fffde7', borderRadius: 10, padding: 14, marginBottom: 20 },
  tipsTitle: { fontWeight: 'bold', color: '#008080', marginBottom: 6 },
  tip: { color: '#555', fontSize: 14, marginBottom: 2 },
  referBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#008080', borderRadius: 8, padding: 12, alignSelf: 'center', marginTop: 10 },
  referBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  postJobBtn: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#008080', padding: 18, alignItems: 'center' },
  postJobBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  emptyMsg: { color: '#888', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalImage: { width: '100%', height: 160, borderRadius: 8, marginBottom: 10 },
  modalText: { fontSize: 14, marginBottom: 12 },
  modalClose: { marginTop: 10, textAlign: 'center', color: '#666' },
  button: { backgroundColor: '#008080', paddingVertical: 10, borderRadius: 6, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
