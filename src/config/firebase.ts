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

// Inicializar App Check com fallback
console.log('Inicializando App Check...');
console.log('Site Key:', APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY);
console.log('Domínio:', window.location.hostname);

// Função para inicializar App Check com fallback
const initAppCheckWithFallback = () => {
  if (APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY) {
    try {
      console.log('Tentando inicializar App Check com reCAPTCHA...');
      
      // Aguardar o reCAPTCHA estar pronto
      if (typeof (window as any).grecaptcha === 'undefined') {
        console.warn('⚠️ reCAPTCHA não carregado, aguardando...');
        
        // Aguardar até 10 segundos pelo reCAPTCHA
        let attempts = 0;
        const checkRecaptcha = () => {
          if (typeof (window as any).grecaptcha !== 'undefined') {
            console.log('✅ reCAPTCHA carregado, inicializando App Check...');
            initializeAppCheckNow();
          } else if (attempts < 20) {
            attempts++;
            setTimeout(checkRecaptcha, 500);
          } else {
            console.error('❌ reCAPTCHA não carregou após 10 segundos');
            initAppCheckFallback();
          }
        };
        
        checkRecaptcha();
        return;
      }
      
      initializeAppCheckNow();
    } catch (error) {
      console.warn('⚠️ App Check com reCAPTCHA falhou, usando fallback:', (error as Error).message);
      initAppCheckFallback();
    }
  } else {
    console.warn('⚠️ Site Key não configurada, usando fallback');
    initAppCheckFallback();
  }
};

// Função para inicializar App Check quando reCAPTCHA estiver pronto
const initializeAppCheckNow = () => {
  try {
    // Inicializar App Check seguindo a documentação oficial
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    
    console.log('✅ App Check inicializado com reCAPTCHA');
    console.log('Provider:', appCheck);
    
    // Exportar a instância do App Check para uso em outros componentes
    (window as any).appCheck = appCheck;
    
    // Verificar se o getToken está disponível
    if (typeof (appCheck as any).getToken === 'function') {
      console.log('✅ App Check funcionando corretamente');
      
      // Testar se consegue obter um token
      (appCheck as any).getToken()
        .then(({ token }: { token: string }) => {
          if (token) {
            console.log('✅ Token App Check obtido com sucesso!');
            console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
          } else {
            console.warn('⚠️ Token App Check vazio');
          }
        })
        .catch((error: any) => {
          console.error('❌ Erro ao obter token App Check:', error);
        });
    } else {
      console.warn('⚠️ App Check sem método getToken - usando fallback');
      initAppCheckFallback();
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar App Check:', (error as Error).message);
    initAppCheckFallback();
  }
};

// Fallback: App Check sem reCAPTCHA (para desenvolvimento)
const initAppCheckFallback = () => {
  console.log('🔄 Inicializando App Check em modo fallback...');
  
  // Criar um App Check mock que funciona sem reCAPTCHA
  const mockAppCheck = {
    getToken: async () => {
      console.log('🔄 Usando token mock do App Check');
      return { token: 'mock-token-' + Date.now() };
    }
  };
  
  // Exportar o mock
  (window as any).appCheck = mockAppCheck;
  console.log('✅ App Check fallback inicializado');
};

// Inicializar App Check
initAppCheckWithFallback();

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
