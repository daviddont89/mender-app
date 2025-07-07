// MapJobsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapJobsScreen() {
  const dummyJobs = [
    { id: '1', title: 'Gutter Cleaning', latitude: 47.6101, longitude: -122.2015 },
    { id: '2', title: 'Fence Repair', latitude: 47.6132, longitude: -122.2036 },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 47.6101,
          longitude: -122.2015,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {dummyJobs.map(job => (
          <Marker
            key={job.id}
            coordinate={{ latitude: job.latitude, longitude: job.longitude }}
            title={job.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
