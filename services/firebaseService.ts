
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { getFirestore, Firestore, doc, setDoc, onSnapshot, DocumentData, getDoc } from "firebase/firestore";
import { MonthData } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCl-W2_kAdpoice9Tdc6psSpJBwYDvQqoQ",
  authDomain: "financas-bispo-brito.firebaseapp.com",
  projectId: "financas-bispo-brito",
  storageBucket: "financas-bispo-brito.firebasestorage.app",
  messagingSenderId: "159834229207",
  appId: "1:159834229207:web:290d078ad03c2e025be392"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let isInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  isInitialized = true;
  console.log("Firebase conectado com sucesso!");
} catch (error) {
  console.error("Erro ao inicializar o Firebase. Verifique sua configuração.", error);
  isInitialized = false;
}

export const isFirebaseConfigured = isInitialized;

export const handleAuth = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      callback(user);
    } else {
      try {
        const userCredential = await signInAnonymously(auth);
        callback(userCredential.user);
      } catch (error) {
        console.error("Anonymous sign-in failed:", error);
        callback(null);
      }
    }
  });
};

export const saveMonthData = async (userId: string, monthKey: string, data: MonthData) => {
  if (!isFirebaseConfigured) return;
  const docRef = doc(db, 'users', userId, 'months', monthKey);
  try {
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
  }
};

export const getMonthData = async (userId: string, monthKey: string): Promise<MonthData | null> => {
    if (!isFirebaseConfigured) return null;
    const docRef = doc(db, 'users', userId, 'months', monthKey);
    try {
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as MonthData : null;
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        return null;
    }
}


export const subscribeToMonthData = (
  userId: string,
  monthKey: string,
  callback: (data: MonthData | null) => void
) => {
  if (!isFirebaseConfigured) {
      callback(null);
      return () => {};
  }
  const docRef = doc(db, 'users', userId, 'months', monthKey);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as MonthData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error with Firestore listener for ${monthKey}:`, error);
    callback(null);
  });

  return unsubscribe;
};