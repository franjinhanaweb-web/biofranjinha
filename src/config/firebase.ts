import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { APP_CHECK_CONFIG, validateAppCheckConfig, getEnvironmentConfig } from './appCheckConfig';

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

// Inicializar App Check com reCAPTCHA
if (validateAppCheckConfig() && APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY) {
  const envConfig = getEnvironmentConfig();
  
  // Escolher provider baseado no tipo de reCAPTCHA
  const recaptchaType = process.env.REACT_APP_RECAPTCHA_TYPE || 'v3';
  const provider = recaptchaType === 'enterprise' 
    ? new ReCaptchaEnterpriseProvider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY)
    : new ReCaptchaV3Provider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY);
  
  const appCheckConfig: any = {
    provider: provider,
    isTokenAutoRefreshEnabled: envConfig.autoRefresh
  };
  
  // Adicionar token de debug apenas em desenvolvimento
  if (envConfig.enableDebugToken && APP_CHECK_CONFIG.DEBUG_TOKEN) {
    // @ts-ignore - Token de debug para desenvolvimento
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = APP_CHECK_CONFIG.DEBUG_TOKEN;
  }
  
  try {
    const appCheck = initializeAppCheck(app, appCheckConfig);
    console.log('App Check inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar App Check:', error);
  }
} else {
  console.warn('App Check não foi inicializado - configuração inválida');
}

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
