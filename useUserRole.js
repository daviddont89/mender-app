// useUserRole.js
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function useUserRole(user) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || 'client'); // default to client
          } else {
            setRole('client');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole('client');
        }
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
}
