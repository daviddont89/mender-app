import React, { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const roleFromStorage = await AsyncStorage.getItem('userRole');

          if (roleFromStorage) {
            setUserRole(roleFromStorage);
          } else {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role;
              setUserRole(role);
              await AsyncStorage.setItem('userRole', role);
            } else {
              console.warn('User role not found, logging out...');
              await signOut(auth);
              setUser(null);
              setUserRole(null);
            }
          }
        } catch (error) {
          console.error('Error loading user role:', error);
          await signOut(auth);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userRole');
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        authLoading,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
