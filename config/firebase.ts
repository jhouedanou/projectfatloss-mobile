import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "projectfatloss-2622b",
  storageBucket: "projectfatloss-2622b.firebasestorage.app",
  apiKey: "AIzaSyDcI3nfZUu5JFhxN3ndnYHnR0fu8i40o3Y",
  authDomain: "projectfatloss-2622b.firebaseapp.com",
  messagingSenderId: "276770563011",
  appId: "1:276770563011:android:60c19fb33d99c2d0f1d376",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
