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

// Inicializar App Check ANTES dos outros serviços
let appCheck: any = null;

// Logs de diagnóstico controlados por NODE_ENV
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

if (isDevelopment || isProduction) {
  console.log('🔍 Firebase App Check - Diagnóstico:');
  console.log('- Ambiente:', process.env.NODE_ENV);
  console.log('- Site Key encontrada:', process.env.REACT_APP_RECAPTCHA_SITE_KEY ? '✅ Sim' : '❌ Não');
  
  if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    console.log('- Site Key (parcial):', siteKey.substring(0, 10) + '...');
    console.log('- Site Key (tamanho):', siteKey.length, 'caracteres');
  }
}

// Proteção contra inicialização dupla
if (!(window as any).__FIREBASE_APP_CHECK_INITIALIZED) {
  if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
    try {
      console.log('🚀 Inicializando App Check...');
      
      // App Check controla o lifecycle do reCAPTCHA automaticamente
      const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error('REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
      }
      
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      
      // Marcar como inicializado
      (window as any).__FIREBASE_APP_CHECK_INITIALIZED = true;
      console.log('✅ App Check configurado com reCAPTCHA v3');
      
    } catch (error) {
      console.error('❌ Erro ao configurar App Check:', error);
    }
  } else {
    console.warn('⚠️ App Check não configurado: REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
    console.warn('📝 Configure a variável no Cloudflare Pages → Settings → Environment Variables');
  }
} else {
  console.log('ℹ️ App Check já inicializado, reutilizando instância');
}

// Inicializar serviços APÓS App Check
export const auth = getAuth(app);
export const db = getFirestore(app, 'biodefranja');

// Exportar instância do App Check para testes
export { appCheck };

export default app;
