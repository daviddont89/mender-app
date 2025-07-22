// IntroScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'slide1',
    title: 'Post a Job',
    text: 'Quickly post what you need done—home repairs, yardwork, or anything else.',
    image: require('./Icons/house-1.png'), // ✅ from zip
  },
  {
    key: 'slide2',
    title: 'Get Paired',
    text: 'We’ll match you with a nearby contractor who’s ready to work.',
    image: require('./Icons/house-5.png'), // ✅ from zip
  },
  {
    key: 'slide3',
    title: 'Track and Pay',
    text: 'Track progress, communicate, and pay—all through the app.',
    image: require('./Icons/Receipt.png'), // ✅ from zip
  },
];

export default function IntroScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      navigation.replace('MenderOnboardingScreen');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    navigation.replace('MenderOnboardingScreen');
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  slide: {
    width,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Quicksand-Bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Quicksand-Regular',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skip: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
});
