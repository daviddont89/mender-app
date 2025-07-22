
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const Slide = ({ image, title, text }) => (
  <View style={styles.slide}>
    <Image source={image} style={styles.image} resizeMode="contain" />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.text}>{text}</Text>
  </View>
);

export default function TutorialCarousel() {
  return (
    <Swiper loop={false} activeDotColor="#008080">
      <Slide
        image={require('./Icons/real estate icon pack/png/calendar-1.png')}
        title="How Mender Works"
        text="Post your job, get matched, and watch it get done — with transparency and care."
      />
      <Slide
        image={require('./Icons/real estate icon pack/png/shield-1.png')}
        title="Trusted Pros Only"
        text="Every contractor is vetted, rated, and backed by Mender's quality standards."
      />
      <Slide
        image={require('./Icons/real estate icon pack/png/invoice.png')}
        title="What You Get for $75/hr"
        text="Clear hourly pricing. No surprises. Professional work from people you can trust."
      />
      <Slide
        image={require('./Icons/real estate icon pack/png/handshake.png')}
        title="You're in Good Hands"
        text="Mender makes home help feel human again. Let's get started."
      />
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
