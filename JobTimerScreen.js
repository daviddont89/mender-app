// JobTimerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Button, TextInput, Alert, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function JobTimerScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params;

  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([
    { label: 'Labor (1 hour minimum)', amount: 100.0 },
  ]);
  const [dumpFee, setDumpFee] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;
        setElapsed(diff);
      }, 1000);
    } else if (!running && startTime) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, startTime]);

  const startClock = () => {
    setStartTime(Date.now());
    setRunning(true);
  };

  const stopClock = () => {
    setRunning(false);
    let minutes = Math.floor(elapsed / 60000);
    if (minutes < 60) minutes = 60; // 1-hour minimum
    else if (minutes % 15 !== 0) minutes = Math.ceil(minutes / 15) * 15;

    const hours = minutes / 60;
    const labor = parseFloat((hours * 100).toFixed(2));
    const updatedItems = invoiceItems.map(item =>
      item.label.startsWith('Labor')
        ? { ...item, amount: labor }
        : item
    );
    setInvoiceItems(updatedItems);
  };

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { label: '', amount: '' }]);
  };

  const handleChangeItem = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = field === 'amount' ? parseFloat(value) : value;
    setInvoiceItems(updated);
  };

  const handleComplete = () => {
    Alert.alert(
      'Complete This Job?',
      'You’ll be asked to upload a final photo and review invoice items.',
      [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          onPress: () =>
            navigation.navigate('CompletedJobConfirmationScreen', {
              job,
              invoiceItems,
              dumpFee,
              notes,
              elapsed,
            }),
        },
      ]
    );
  };

  const handleIncomplete = () => {
    Alert.prompt(
      'Mark Job Incomplete',
      'Please enter a reason. An admin will review your response.',
      (text) => {
        console.log('Admin notified with reason:', text);
        Alert.alert('Notified', 'Admin has been notified.');
        navigation.goBack();
      }
    );
  };

  const total = invoiceItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const dumpTotal = dumpFee ? parseFloat(dumpFee) + 25 : 0; // Flat fee + dump cost
  const grandTotal = total + dumpTotal;
  const contractorPay = parseFloat(((grandTotal * 0.6)).toFixed(2));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.status}>Status: In Progress</Text>

      {/* Timer */}
      <View style={styles.timerBlock}>
        <Text style={styles.clockLabel}>Time Logged</Text>
        <Text style={styles.clockValue}>
          {Math.floor(elapsed / 3600000)}h {Math.floor((elapsed % 3600000) / 60000)}m
        </Text>
        {!running ? (
          <Button title="Start Timer" onPress={startClock} />
        ) : (
          <Button title="Stop Timer" onPress={stopClock} color="#cc0000" />
        )}
      </View>

      {/* Job Photos */}
      {job.photos?.length > 0 && (
        <View style={styles.photoBox}>
          <Text style={styles.sectionHeader}>Job Photos</Text>
          <ScrollView horizontal>
            {job.photos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.photo} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Invoice Preview */}
      <Text style={styles.sectionHeader}>Invoice Preview</Text>
      {invoiceItems.map((item, idx) => (
        <View key={idx} style={styles.invoiceItem}>
          <TextInput
            style={styles.input}
            placeholder="Label"
            value={item.label}
            onChangeText={(val) => handleChangeItem(idx, 'label', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={item.amount.toString()}
            keyboardType="numeric"
            onChangeText={(val) => handleChangeItem(idx, 'amount', val)}
          />
        </View>
      ))}
      <Button title="Add Invoice Item" onPress={handleAddItem} />

      {/* Dump Fee */}
      <Text style={styles.sectionHeader}>Dump Fee (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount Charged at Dump"
        value={dumpFee}
        keyboardType="numeric"
        onChangeText={setDumpFee}
      />

      {/* Notes */}
      <Text style={styles.sectionHeader}>Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Any notes about the job..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summary}>Total Billed: ${grandTotal.toFixed(2)}</Text>
        <Text style={styles.summary}>Estimated Earnings: ${contractorPay}</Text>
      </View>

      {/* Actions */}
      <Button title="Complete Job" onPress={handleComplete} />
      <View style={{ marginVertical: 8 }} />
      <Button title="Mark Incomplete" onPress={handleIncomplete} color="#999" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080' },
  status: { marginBottom: 16, fontSize: 15, color: '#555' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12,
  },
  timerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  clockLabel: { fontSize: 16 },
  clockValue: { fontSize: 28, fontWeight: 'bold', marginVertical: 6 },
  invoiceItem: { marginBottom: 10 },
  photoBox: { marginTop: 10 },
  photo: { width: 80, height: 80, marginRight: 10, borderRadius: 8 },
  summaryBox: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 10,
  },
  summary: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});
