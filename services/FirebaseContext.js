import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Remplace ces valeurs par tes propres clés Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const login = async (email, password, navigation) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigation.replace('Home');
    } catch (e) {
      setError('Erreur de connexion');
    }
  };

  const signup = async (email, password, navigation) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      navigation.replace('Home');
    } catch (e) {
      setError('Erreur lors de l\'inscription');
    }
  };

  const logout = async (navigation) => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <FirebaseContext.Provider value={{ user, login, signup, logout, error, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}
