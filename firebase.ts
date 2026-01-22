
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDXP-aTds9cEidyKrKsZYxZdx4DbPi19ZQ",
  authDomain: "playstaion-system.firebaseapp.com",
  projectId: "playstaion-system",
  storageBucket: "playstaion-system.firebasestorage.app",
  messagingSenderId: "420470134277",
  appId: "1:420470134277:web:291b5d5bbfb78b5d91ee6c",
  measurementId: "G-MRF8T44CHH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, analytics };
