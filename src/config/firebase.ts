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

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app, 'biodefranja');

// Configurar App Check apenas se Site Key estiver disponível
console.log('🔍 Debug App Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY ? '✅ Encontrada' : '❌ Não encontrada');

if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
  try {
    console.log('🚀 Inicializando App Check...');
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    console.log('✅ App Check configurado com reCAPTCHA v3');
    
    // Verificar se o token está sendo gerado
    setTimeout(() => {
      console.log('🔍 Verificando token do App Check...');
      // Aqui vamos verificar se o token está sendo gerado
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao configurar App Check:', error);
  }
} else {
  console.warn('⚠️ App Check não configurado: REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
}

export default app;
