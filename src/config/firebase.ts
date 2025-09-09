import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Configuração do Firebase usando variáveis de ambiente do Cloudflare
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar App Check com reCAPTCHA v3
let appCheck: any = null;
if (process.env.NODE_ENV === 'production') {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true
  });
}

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export { appCheck };

export default app;
