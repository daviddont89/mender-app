// ContractorPaymentScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Image
} from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function ContractorPaymentScreen() {
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      const snapshot = await getDocs(collection(db, 'invoices'));
      const jobsWithInvoices = [];
      for (let docSnap of snapshot.docs) {
        const invoice = docSnap.data();
        const jobRef = doc(db, 'jobs', invoice.jobId);
        const jobSnap = await getDoc(jobRef);
        jobsWithInvoices.push({
          id: docSnap.id,
          invoice,
          job: jobSnap.exists() ? jobSnap.data() : {},
        });
      }
      setJobs(jobsWithInvoices);
    };

    fetchPayments();
  }, []);

  const toggleExpand = (id) => {
    setExpandedJobId(prev => (prev === id ? null : id));
  };

  const getNextFriday = () => {
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + ((12 - today.getDay()) % 7 || 7));
    return next.toLocaleDateString();
  };

  const totalPaid = jobs.reduce((sum, j) => j.invoice.status === 'paid' ? sum + j.invoice.contractorTotal : sum, 0);
  const upcoming = jobs.filter(j => j.invoice.status === 'pending').reduce((sum, j) => sum + j.invoice.contractorTotal, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>💸 Upcoming Payout</Text>
      <View style={styles.statsBox}>
        <Text style={styles.stat}>Next payout: ${upcoming.toFixed(2)} this Friday</Text>
        <Text style={styles.stat}>Paid YTD: ${totalPaid.toFixed(2)}</Text>
        <Text style={styles.stat}>Ad Credits: ${(totalPaid * 0.01).toFixed(2)} earned</Text>
      </View>

      <TouchableOpacity onPress={() => setCalendarVisible(true)}>
        <Text style={styles.link}>📅 View Payment Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pastJobsBtn}>
        <Text style={styles.pastJobsText}>View Past Jobs</Text>
      </TouchableOpacity>

      <Text style={styles.subheader}>Completed Jobs</Text>

      <View style={styles.cardScroll}>
        {jobs.map(({ id, invoice, job }) => (
          <TouchableOpacity
            key={id}
            style={styles.card}
            onPress={() => toggleExpand(id)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{job.title || 'Untitled Job'}</Text>
              <Text style={styles.cardMeta}>{job.location || 'Unknown location'}</Text>
              <Text style={styles.cardMeta}>Payout: ${invoice.contractorTotal.toFixed(2)} this Friday</Text>
            </View>

            {expandedJobId === id && (
              <View style={styles.cardExpanded}>
                <Text style={styles.sectionTitle}>Invoice Breakdown</Text>
                {invoice.items.map((item, i) => (
                  <View key={i} style={styles.lineItem}>
                    <Text>{item.label}</Text>
                    <Text>${parseFloat(item.amount).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={styles.lineItem}>
                  <Text>Tax ({(invoice.taxRate * 100).toFixed(1)}%)</Text>
                  <Text>${(invoice.contractorTotal * invoice.taxRate).toFixed(2)}</Text>
                </View>
                <View style={styles.lineItemTotal}>
                  <Text>Total Payable</Text>
                  <Text>${invoice.contractorTotal.toFixed(2)}</Text>
                </View>

                <Text style={styles.sectionTitle}>Uploaded Files</Text>
                {invoice.mediaUrls?.length > 0 ? (
                  <FlatList
                    horizontal
                    data={invoice.mediaUrls}
                    keyExtractor={(uri, idx) => idx.toString()}
                    renderItem={({ item }) => (
                      <Image source={{ uri: item }} style={styles.media} />
                    )}
                  />
                ) : (
                  <Text style={{ color: '#777' }}>No media uploaded.</Text>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryText}>Dispute</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryText}>Message Support</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={calendarVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>📆 Payout Schedule</Text>
          <Text style={styles.modalText}>
            All jobs completed before 5pm Thursday are paid out Friday afternoon.
            Holidays may delay this by 1 business day.
          </Text>
          <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.modalClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#008080' },
  statsBox: {
    backgroundColor: '#f0f8ff', padding: 14, borderRadius: 8, marginBottom: 10,
  },
  stat: { fontSize: 16, marginBottom: 4 },
  link: { color: '#008080', marginVertical: 10, fontWeight: '500' },
  pastJobsBtn: {
    backgroundColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 14,
    alignItems: 'center',
  },
  pastJobsText: { color: '#333' },
  subheader: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  cardScroll: { paddingBottom: 20 },
  card: {
    backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12,
    marginBottom: 12, borderColor: '#ddd', borderWidth: 1,
  },
  cardHeader: { marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardMeta: { fontSize: 14, color: '#555' },
  cardExpanded: { marginTop: 10 },
  sectionTitle: { fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  lineItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 4,
  },
  lineItemTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderTopWidth: 1, borderColor: '#ccc', marginTop: 6,
  },
  media: {
    width: 100, height: 80, borderRadius: 6, marginRight: 10,
  },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 16,
  },
  secondaryBtn: {
    backgroundColor: '#ddd', padding: 10,
    borderRadius: 6, flex: 1, marginHorizontal: 4, alignItems: 'center',
  },
  secondaryText: { fontWeight: '600' },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  modalClose: {
    backgroundColor: '#008080', padding: 12, borderRadius: 8,
  },
  modalCloseText: { color: '#fff', fontWeight: 'bold' },
});
