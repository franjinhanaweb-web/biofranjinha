import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

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

// App Check será inicializado se Site Key estiver disponível

// Proteção contra inicialização dupla
if (!(window as any).__FIREBASE_APP_CHECK_INITIALIZED) {
  console.log('Inicializando App Check...');
  console.log('REACT_APP_RECAPTCHA_SITE_KEY disponível:', !!process.env.REACT_APP_RECAPTCHA_SITE_KEY);
  
  if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
    try {
      const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error('REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
      }
      
      console.log('Configurando App Check com site key:', siteKey.substring(0, 10) + '...');
      
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      
      // Marcar como inicializado
      (window as any).__FIREBASE_APP_CHECK_INITIALIZED = true;
      
      console.log('App Check inicializado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao configurar App Check:', error);
    }
  } else {
    console.warn('REACT_APP_RECAPTCHA_SITE_KEY não encontrada - App Check não será inicializado');
  }
} else {
  console.log('App Check já foi inicializado anteriormente');
}

// Inicializar serviços APÓS App Check
export const auth = getAuth(app);
export const db = getFirestore(app, 'biodefranja');

// Exportar instância do App Check para testes
export { appCheck };

export default app;
