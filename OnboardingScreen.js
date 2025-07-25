import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

export default function OnboardingScreen({ navigation }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const buttonsY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: -80,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./Icons/mender-banner.png')}
        style={[styles.logo, { width: screenWidth * 0.8, alignSelf: 'center', transform: [{ translateY: logoAnim }] }]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.textContainer, { opacity: contentOpacity }]}>
        <Text style={styles.title}>Welcome to Mender</Text>
        <Text style={styles.subtitle}>
          Premium home repair and maintenance — from trusted local pros.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsY }] }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonOutlineText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('ContractorOnboardingScreen')}
        >
          <Text style={styles.linkText}>Apply as a Contractor</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logo: {
    height: 80,
    marginBottom: 20,
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 50,
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonOutline: {
    borderColor: '#008080',
    borderWidth: 2,
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonOutlineText: {
    color: '#008080',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
