// src/firebase.ts
import { initializeApp } from "firebase/app";
import { persistentLocalCache, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBu704ys7A02ltinNP4VtAzxIlpIl0W31cc",
  authDomain: "vaultmaster-486b2.firebaseapp.com",
  projectId: "vaultmaster-486b2",
  storageBucket: "vaultmaster-486b2.appspot.com",
  messagingSenderId: "377129919962",
  appId: "1:377129919962:web:1466b835f595e2132fcce3"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(), // enables offline persistence
});

export { db };