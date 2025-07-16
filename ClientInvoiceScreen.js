// ClientInvoiceScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function ClientInvoiceScreen() {
  const route = useRoute();
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const docRef = doc(db, 'invoices', invoiceId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setInvoice(snap.data());
        }
      } catch (e) {
        console.error('Failed to load invoice', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (!invoice) return <Text style={styles.error}>Invoice not found.</Text>;

  const total = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const tax = invoice.taxRate ? (total * invoice.taxRate).toFixed(2) : 0;
  const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Invoice Summary</Text>

      <Text style={styles.subHeader}>Job: {invoice.jobTitle}</Text>
      <Text style={styles.subHeader}>Contractor: {invoice.contractorName}</Text>

      <View style={styles.section}>
        {invoice.items.map((item, idx) => (
          <View key={idx} style={styles.lineItem}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.lineItem}>
          <Text style={styles.itemLabel}>Subtotal</Text>
          <Text style={styles.itemAmount}>${total.toFixed(2)}</Text>
        </View>

        {invoice.taxRate && (
          <View style={styles.lineItem}>
            <Text style={styles.itemLabel}>Tax ({(invoice.taxRate * 100).toFixed(1)}%)</Text>
            <Text style={styles.itemAmount}>${tax}</Text>
          </View>
        )}

        <View style={styles.lineItem}>
          <Text style={styles.itemLabelTotal}>Total Due</Text>
          <Text style={styles.itemAmountTotal}>${grandTotal}</Text>
        </View>
      </View>

      <Text style={styles.note}>💡 Payment methods coming soon. We'll charge your saved payment method or let you choose at checkout.</Text>

      <Button title="Pay Now (placeholder)" onPress={() => alert('Payment processing coming soon.')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#008080' },
  subHeader: { fontSize: 16, marginBottom: 6, color: '#444' },
  section: { marginVertical: 20 },
  lineItem: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 6,
  },
  itemLabel: { fontSize: 16 },
  itemAmount: { fontSize: 16 },
  itemLabelTotal: { fontSize: 18, fontWeight: 'bold' },
  itemAmountTotal: { fontSize: 18, fontWeight: 'bold' },
  note: { fontSize: 13, color: '#888', marginBottom: 20 },
  error: { marginTop: 40, textAlign: 'center', fontStyle: 'italic' },
});
