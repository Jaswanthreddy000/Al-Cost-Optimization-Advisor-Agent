
const firebaseConfig = {
  apiKey: "AIzaSyCfLTP82i0r6vs2tZIgxapLhLsJ8Pg0LdQ",
  authDomain: "aicostoptimiser.firebaseapp.com",
  projectId: "aicostoptimiser",
  storageBucket: "aicostoptimiser.firebasestorage.app",
  messagingSenderId: "1007132779232",
  appId: "1:1007132779232:web:49f276d7cd50637342a685",
  measurementId: "G-PR4V257LE0"
};

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
