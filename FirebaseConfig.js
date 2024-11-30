import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "NA",
  authDomain: "musiccataloger-e0e33.firebaseapp.com",
  projectId: "musiccataloger-e0e33",
  storageBucket: "musiccataloger-e0e33.firebasestorage.app",
  messagingSenderId: "272077126137",
  appId: "1:272077126137:web:75c70d261f4ea17352a528",
  measurementId: "G-9H5R59KB9F"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
