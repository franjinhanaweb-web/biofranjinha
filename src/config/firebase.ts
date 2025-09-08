import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { APP_CHECK_CONFIG, getEnvironmentConfig } from './appCheckConfig';

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
console.log('Inicializando App Check...');
console.log('Site Key:', APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY);

if (APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY) {
  const envConfig = getEnvironmentConfig();
  
  // Usar reCAPTCHA v3 por padrão
  const provider = new ReCaptchaV3Provider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY);
  
  const appCheckConfig = {
    provider: provider,
    isTokenAutoRefreshEnabled: envConfig.autoRefresh
  };
  
  // Adicionar token de debug apenas em desenvolvimento
  if (envConfig.enableDebugToken && APP_CHECK_CONFIG.DEBUG_TOKEN) {
    // @ts-ignore - Token de debug para desenvolvimento
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = APP_CHECK_CONFIG.DEBUG_TOKEN;
    console.log('Token de debug configurado:', APP_CHECK_CONFIG.DEBUG_TOKEN);
  }
  
  try {
    const appCheck = initializeAppCheck(app, appCheckConfig);
    console.log('✅ App Check inicializado com sucesso!');
    console.log('Provider:', provider);
    // Exportar a instância do App Check para uso em outros componentes
    (window as any).appCheck = appCheck;
  } catch (error) {
    console.error('❌ Erro ao inicializar App Check:', error);
  }
} else {
  console.warn('⚠️ App Check não foi inicializado - RECAPTCHA_SITE_KEY não encontrado');
}

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
