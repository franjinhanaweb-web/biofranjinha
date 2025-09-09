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

// Inicializar App Check com reCAPTCHA v3 PRIMEIRO
let appCheck: any = null;
if (process.env.NODE_ENV === 'production') {
  try {
    console.log('Inicializando App Check...');
    console.log('reCAPTCHA Site Key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY ? 'Configurada' : 'Não configurada');
    
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY!),
      isTokenAutoRefreshEnabled: true
    });
    
    console.log('App Check configurado e ativo para produção');
    console.log('App Check instance:', appCheck);
    
    // Verificar se o App Check está funcionando
    appCheck.getToken().then((token: any) => {
      console.log('App Check token obtido na inicialização:', token.token ? 'Sim' : 'Não');
    }).catch((error: any) => {
      console.error('Erro ao obter token na inicialização:', error);
    });
    
  } catch (error) {
    console.error('Erro ao inicializar App Check:', error);
  }
} else {
  console.log('App Check desabilitado (desenvolvimento)');
}

// Inicializar serviços APÓS o App Check
export const auth = getAuth(app);
export const db = getFirestore(app);
export { appCheck };

// Configurar App Check para ser usado automaticamente pelo Firestore
if (appCheck) {
  // O App Check será usado automaticamente pelo Firestore quando configurado corretamente
  console.log('Firestore configurado para usar App Check automaticamente');
} else {
  console.log('Firestore sem App Check (desenvolvimento)');
}

export default app;
