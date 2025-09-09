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
    console.log('🔑 Site Key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY.substring(0, 10) + '...');
    
    // Verificar se o reCAPTCHA está carregado
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      console.log('✅ reCAPTCHA carregado no navegador');
    } else {
      console.warn('⚠️ reCAPTCHA não carregado no navegador');
    }
    
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    console.log('✅ App Check configurado com reCAPTCHA v3');
    
    // Verificar se o token está sendo gerado
    setTimeout(async () => {
      console.log('🔍 Verificando token do App Check...');
      try {
        const { getToken } = await import('firebase/app-check');
        const appCheck = await import('firebase/app-check');
        const token = await getToken(appCheck.getAppCheck(app));
        console.log('✅ Token do App Check gerado:', token.token.substring(0, 20) + '...');
      } catch (error) {
        console.error('❌ Erro ao gerar token do App Check:', error);
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao configurar App Check:', error);
  }
} else {
  console.warn('⚠️ App Check não configurado: REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
}

export default app;
