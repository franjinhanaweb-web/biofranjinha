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
    
    // Carregar reCAPTCHA dinamicamente com Site Key do Cloudflare
    const loadRecaptcha = () => {
      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && (window as any).grecaptcha) {
          console.log('✅ reCAPTCHA já carregado');
          resolve(true);
          return;
        }

        console.log('🔍 Carregando reCAPTCHA com Site Key do Cloudflare...');
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('✅ reCAPTCHA carregado dinamicamente');
          resolve(true);
        };
        script.onerror = () => {
          console.error('❌ Erro ao carregar reCAPTCHA');
          reject(new Error('Failed to load reCAPTCHA'));
        };
        document.head.appendChild(script);
      });
    };

    // Aguardar reCAPTCHA carregar completamente
    const waitForRecaptcha = () => {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined' && (window as any).grecaptcha && (window as any).grecaptcha.ready) {
          console.log('✅ reCAPTCHA pronto no navegador');
          console.log('🔍 reCAPTCHA version:', (window as any).grecaptcha.version);
          resolve(true);
        } else {
          console.warn('⚠️ Aguardando reCAPTCHA inicializar...');
          setTimeout(() => waitForRecaptcha().then(resolve), 100);
        }
      });
    };

    // Carregar reCAPTCHA, aguardar inicializar e depois configurar App Check
    loadRecaptcha()
      .then(() => waitForRecaptcha())
      .then(() => {
        try {
          const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
          if (!siteKey) {
            throw new Error('REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
          }
          
          initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(siteKey),
            isTokenAutoRefreshEnabled: true
          });
          console.log('✅ App Check configurado com reCAPTCHA v3');
        } catch (error) {
          console.error('❌ Erro ao configurar App Check:', error);
        }
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar reCAPTCHA:', error);
      });
    
    // App Check configurado - token será gerado automaticamente quando necessário
    console.log('🔍 App Check pronto - token será gerado automaticamente');
    
  } catch (error) {
    console.error('❌ Erro ao configurar App Check:', error);
  }
} else {
  console.warn('⚠️ App Check não configurado: REACT_APP_RECAPTCHA_SITE_KEY não encontrada');
}

export default app;
