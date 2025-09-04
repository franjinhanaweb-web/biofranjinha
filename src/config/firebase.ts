import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCa9StxgMoJ3FTzGHvYJy7DiwK_KAFujAo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "keyfirebase-68e84.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "keyfirebase-68e84",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "keyfirebase-68e84.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "56213864487",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:56213864487:web:59262a0ac202523e274e02",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-Y56E3DS4JC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
