import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import app from '../config/firebase';

// Configuração do App Check
export const initializeAppCheckService = () => {
  try {
    // Verificar se estamos em produção
    if (process.env.NODE_ENV === 'production') {
      const siteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY;
      
      if (!siteKey) {
        console.warn('⚠️ App Check não configurado: REACT_APP_FIREBASE_APP_CHECK_SITE_KEY não encontrada');
        return;
      }

      // Inicializar App Check com reCAPTCHA v3
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });

      console.log('✅ App Check inicializado com reCAPTCHA v3');
      return appCheck;
    } else {
      console.log('🔧 App Check desabilitado em desenvolvimento');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar App Check:', error);
    return null;
  }
};

// Verificar se App Check está ativo
export const isAppCheckEnabled = (): boolean => {
  return process.env.NODE_ENV === 'production' && 
         !!process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY;
};

// Configurações do App Check
export const APP_CHECK_CONFIG = {
  // Site key do reCAPTCHA v3 (configurar no Firebase Console)
  SITE_KEY: process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY,
  
  // Configurações de segurança
  SECURITY: {
    // Forçar App Check em todas as operações
    ENFORCE: true,
    
    // Auto-refresh do token
    AUTO_REFRESH: true,
    
    // Timeout para validação
    TIMEOUT: 10000
  }
};
