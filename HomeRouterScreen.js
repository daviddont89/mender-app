import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeRouterScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.replace('Login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;

        if (role === 'contractor') {
          navigation.replace('ContractorHome');
        } else if (role === 'client') {
          navigation.replace('ClientHome');
        } else if (role === 'admin') {
          navigation.replace('AdminHome');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Role-based redirect failed:', error);
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default HomeRouterScreen;
