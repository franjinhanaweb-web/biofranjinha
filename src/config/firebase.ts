import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { APP_CHECK_CONFIG } from './appCheckConfig';

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

if (APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY) {
  // Aguardar o reCAPTCHA carregar antes de inicializar
  const initAppCheck = () => {
    if (typeof (window as any).grecaptcha === 'undefined') {
      console.log('Aguardando reCAPTCHA carregar...');
      setTimeout(initAppCheck, 1000);
      return;
    }
    
    try {
      console.log('reCAPTCHA carregado, inicializando App Check...');
      
      // Inicializar App Check seguindo a documentação oficial
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
      
      console.log('✅ App Check inicializado');
      
      // Exportar a instância do App Check para uso em outros componentes
      (window as any).appCheck = appCheck;
      
      // Verificar se o getToken está disponível
      if (typeof (appCheck as any).getToken === 'function') {
        console.log('✅ App Check funcionando corretamente');
      } else {
        console.warn('⚠️ App Check sem método getToken - aguardando inicialização...');
        
        // Aguardar um pouco e tentar novamente
        setTimeout(() => {
          if (typeof (window as any).appCheck?.getToken === 'function') {
            console.log('✅ App Check agora está funcionando');
          } else {
            console.error('❌ App Check não funcionou - verifique configuração no Firebase Console');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar App Check:', error);
    }
  };
  
  // Inicializar com delay para garantir que reCAPTCHA esteja pronto
  setTimeout(initAppCheck, 2000);
} else {
  console.warn('⚠️ App Check não foi inicializado - RECAPTCHA_SITE_KEY não encontrado');
}

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
