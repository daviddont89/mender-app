import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logoY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1.2)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoY, {
          toValue: -80,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(formY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('Attempting sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in:', userCredential.user.uid);
      const uid = userCredential.user.uid;

      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', uid));
        console.log('Fetched userDoc:', userDoc.exists());
      } catch (firestoreErr) {
        console.log('Firestore error:', firestoreErr);
        setError('Could not fetch user profile.');
        setLoading(false);
        return;
      }

      if (userDoc.exists()) {
        const { role } = userDoc.data();
        await AsyncStorage.setItem('userRole', role || 'client');
        console.log('Role:', role);

        if (role === 'contractor') {
          navigation.replace('ContractorHomeScreen');
        } else if (role === 'admin') {
          navigation.replace('AdminHomeScreen');
        } else {
          navigation.replace('ClientHomeScreen');
        }
      } else {
        setError('User profile not found.');
        console.log('User profile not found.');
      }
    } catch (err) {
      setError('Invalid email or password.');
      console.log('Login error:', err);
    }
    setLoading(false);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.Image
        source={require('./Icons/mender-banner.png')}
        style={[
          styles.logo,
          { width: screenWidth * 0.8, alignSelf: 'center', transform: [
            { translateY: logoY },
            { scale: logoScale },
          ] },
        ]}
        resizeMode="contain"
      />

      <Animated.View
        style={[
          styles.form,
          {
            opacity: contentOpacity,
            transform: [{ translateY: formY }],
          },
        ]}
      >
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={styles.linkText}>Back to Welcome</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 80,
    marginBottom: 0,
    alignSelf: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 14,
  },
  linkText: {
    color: '#555',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
