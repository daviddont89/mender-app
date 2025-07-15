import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Ionicons } from '@expo/vector-icons';

const slides = [
  {
    key: 'slide1',
    title: 'Welcome to Mender!',
    description: 'Your one-stop app for finding reliable contractors.',
    image: require('./assets/slide1.png'),
  },
  {
    key: 'slide2',
    title: 'Post a Job Easily',
    description: 'Fill out a form, upload media, and get started.',
    image: require('./assets/slide2.png'),
  },
  {
    key: 'slide3',
    title: 'Track Progress',
    description: 'Monitor work and communicate clearly.',
    image: require('./assets/slide3.png'),
  },
];

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'jobs'),
        where('clientId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const jobData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobData);
    };

    fetchJobs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    const nextIndex = Math.min(currentSlideIndex + 1, slides.length - 1);
    flatListRef.current.scrollToIndex({ index: nextIndex });
    setCurrentSlideIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentSlideIndex - 1, 0);
    flatListRef.current.scrollToIndex({ index: prevIndex });
    setCurrentSlideIndex(prevIndex);
  };

  const handlePostJob = () => navigation.navigate('PostJobScreen');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mender</Text>
        <View style={{ width: 28 }} />
      </View>

      {jobs.length === 0 ? (
        <View style={styles.slideshowContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentSlideIndex(newIndex);
            }}
            initialScrollIndex={0}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={handlePrev} disabled={currentSlideIndex === 0}>
              <Ionicons name="arrow-back-circle" size={32} color={currentSlideIndex === 0 ? '#ccc' : '#007f7f'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} disabled={currentSlideIndex === slides.length - 1}>
              <Ionicons name="arrow-forward-circle" size={32} color={currentSlideIndex === slides.length - 1 ? '#ccc' : '#007f7f'} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {/* TODO: Show job cards or active client data */}
          <Text>Your posted jobs will appear here.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePostJob}>
        <Text style={styles.buttonText}>Post a Job</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007f7f',
  },
  slideshowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#007f7f',
    padding: 16,
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
