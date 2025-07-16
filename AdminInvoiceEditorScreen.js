// AdminInvoiceEditorScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Button, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import {
  doc, getDoc, updateDoc
} from 'firebase/firestore';

export default function AdminInvoiceEditorScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { invoiceId } = route.params;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItems, setEditingItems] = useState([]);
  const [dumpFee, setDumpFee] = useState('');
  const [taxRate, setTaxRate] = useState('8.7'); // default % for WA
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const snap = await getDoc(doc(db, 'invoices', invoiceId));
        if (snap.exists()) {
          const data = snap.data();
          setInvoice(data);
          setEditingItems(data.items || []);
          setDumpFee(data.dumpFee?.toString() || '');
          setNotes(data.notes || '');
          setStatus(data.status || 'pending');
          setTaxRate(data.taxRate?.toString() || '8.7');
        } else {
          Alert.alert('Error', 'Invoice not found');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleChangeItem = (idx, field, value) => {
    const updated = [...editingItems];
    updated[idx][field] = field === 'amount' ? parseFloat(value) : value;
    setEditingItems(updated);
  };

  const handleSave = async () => {
    const dump = parseFloat(dumpFee || 0);
    const tax = parseFloat(taxRate || 0);
    const subtotal = editingItems.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const dumpTotal = dump > 0 ? dump + 25 : 0;
    const taxAmount = ((subtotal + dumpTotal) * tax) / 100;
    const grandTotal = subtotal + dumpTotal + taxAmount;
    const contractorPay = parseFloat((grandTotal * 0.6).toFixed(2));

    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        items: editingItems,
        dumpFee: dump,
        taxRate: tax,
        total: grandTotal,
        contractorPay,
        notes,
        status,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('Saved', 'Invoice updated');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save invoice');
    }
  };

  if (loading || !invoice) return <Text style={{ padding: 20 }}>Loading...</Text>;

  const subtotal = editingItems.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const dumpTotal = dumpFee ? parseFloat(dumpFee) + 25 : 0;
  const taxAmount = ((subtotal + dumpTotal) * parseFloat(taxRate)) / 100;
  const grandTotal = subtotal + dumpTotal + taxAmount;
  const contractorPay = parseFloat((grandTotal * 0.6).toFixed(2));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Invoice</Text>

      <Text style={styles.label}>Job ID: {invoice.jobId}</Text>
      <Text style={styles.label}>Contractor ID: {invoice.contractorId}</Text>
      <Text style={styles.label}>Client ID: {invoice.clientId}</Text>

      <Text style={styles.section}>Line Items</Text>
      {editingItems.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Label"
            value={item.label}
            onChangeText={(val) => handleChangeItem(idx, 'label', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={item.amount.toString()}
            onChangeText={(val) => handleChangeItem(idx, 'amount', val)}
          />
        </View>
      ))}

      <Text style={styles.section}>Dump Fee Charged</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 45"
        value={dumpFee}
        keyboardType="numeric"
        onChangeText={setDumpFee}
      />

      <Text style={styles.section}>Tax Rate (%)</Text>
      <TextInput
        style={styles.input}
        value={taxRate}
        keyboardType="numeric"
        onChangeText={setTaxRate}
      />

      <Text style={styles.section}>Invoice Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <Text style={styles.section}>Invoice Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="pending / approved / rejected"
      />

      <View style={styles.summaryBox}>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text>Dump: ${dumpTotal.toFixed(2)}</Text>
        <Text>Tax: ${taxAmount.toFixed(2)}</Text>
        <Text>Total: ${grandTotal.toFixed(2)}</Text>
        <Text>Contractor Pay: ${contractorPay}</Text>
      </View>

      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 10 },
  section: { fontWeight: 'bold', fontSize: 16, marginTop: 20 },
  label: { fontSize: 14, marginBottom: 4, color: '#555' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, width: '100%',
  },
  row: { marginBottom: 12 },
  summaryBox: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
});
