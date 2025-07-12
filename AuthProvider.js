import React, { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState(null);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const storedRole = await AsyncStorage.getItem('userRole');
          if (storedRole) {
            setRole(storedRole);
          } else {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const fetchedRole = userDoc.data().role;
              setRole(fetchedRole);
              await AsyncStorage.setItem('userRole', fetchedRole);
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setRole(null);
        await AsyncStorage.removeItem('userRole');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const fetchedRole = userDoc.data().role;
        setRole(fetchedRole);
        await AsyncStorage.setItem('userRole', fetchedRole);
      }

      setUser(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, selectedRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        email,
        role: selectedRole,
      });

      setRole(selectedRole);
      await AsyncStorage.setItem('userRole', selectedRole);
      setUser(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      await AsyncStorage.removeItem('userRole');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        role,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
