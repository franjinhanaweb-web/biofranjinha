import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';

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
    console.log('[App Check] Inicializando App Check...');
    console.log('[App Check] reCAPTCHA Site Key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY ? 'Configurada' : 'Não configurada');
    
    // NÃO chamar getToken() aqui! Apenas inicializar
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY!),
      isTokenAutoRefreshEnabled: true
    });
    
    console.log('[App Check] App Check inicializado com sucesso!');
    console.log('[App Check] Firestore usará App Check automaticamente');
    
  } catch (error) {
    console.error('[App Check] Erro ao inicializar App Check:', error);
  }
} else {
  console.log('[App Check] Modo desenvolvimento - App Check desabilitado');
}

// Inicializar serviços APÓS o App Check
export const auth = getAuth(app);
export const db = getFirestore(app);
export { appCheck };

// Função para obter token manualmente (se necessário)
export async function getAppCheckToken() {
  if (appCheck) {
    try {
      const { token } = await getToken(appCheck, false);
      return token;
    } catch (error) {
      console.error('[App Check] Erro ao obter token:', error);
      return null;
    }
  }
  return null;
}

export default app;
