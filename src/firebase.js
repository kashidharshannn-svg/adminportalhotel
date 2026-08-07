import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Set this to true when you want to connect to your live Google Firebase project.
// You must also fill in the firebaseConfig credentials below.
export const IS_FIREBASE_ACTIVE = true;

const firebaseConfig = {
  apiKey: "AIzaSyCP_aLPox0j1Kuafe5WDmKePFEh3df3zjo",
  authDomain: "tripcustomizer-hotel.firebaseapp.com",
  projectId: "tripcustomizer-hotel",
  storageBucket: "tripcustomizer-hotel.firebasestorage.app",
  messagingSenderId: "608651583118",
  appId: "1:608651583118:web:42ee61dd3c68c4c70f33df",
  measurementId: "G-Z93WKKFV39"
};

let app, auth, db;

if (IS_FIREBASE_ACTIVE) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence
    });
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Failed:", error);
  }
}

export { auth, db };
