import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import app from '../config/firebase';

// Configuração do App Check
export const initializeAppCheckService = () => {
  try {
    // Verificar se App Check está desabilitado via variável de ambiente
    if (process.env.REACT_APP_DISABLE_APP_CHECK === 'true') {
      console.log('🔧 App Check desabilitado via REACT_APP_DISABLE_APP_CHECK');
      return null;
    }

    // Verificar se estamos em produção
    if (process.env.NODE_ENV === 'production') {
      // Tentar diferentes nomes de variáveis de ambiente
      const siteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
                     process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                     process.env.RECAPTCHA_SITE_KEY;
      
      if (!siteKey) {
        console.warn('⚠️ App Check não configurado: Site key do reCAPTCHA não encontrada');
        console.warn('Verifique se REACT_APP_RECAPTCHA_SITE_KEY está configurada nas variáveis de ambiente');
        console.warn('Variáveis disponíveis:', {
          'REACT_APP_FIREBASE_APP_CHECK_SITE_KEY': !!process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY,
          'REACT_APP_RECAPTCHA_SITE_KEY': !!process.env.REACT_APP_RECAPTCHA_SITE_KEY,
          'RECAPTCHA_SITE_KEY': !!process.env.RECAPTCHA_SITE_KEY
        });
        return;
      }

      console.log('🔑 Site key detectada:', siteKey.substring(0, 10) + '...');
      
      // Identificar qual variável de ambiente foi usada
      const siteKeySource = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY ? 'REACT_APP_FIREBASE_APP_CHECK_SITE_KEY' :
                           process.env.REACT_APP_RECAPTCHA_SITE_KEY ? 'REACT_APP_RECAPTCHA_SITE_KEY' :
                           process.env.RECAPTCHA_SITE_KEY ? 'RECAPTCHA_SITE_KEY' : 'desconhecida';
      
      console.log('📋 Fonte da site key:', siteKeySource);
      console.log('🔧 Provedor: reCAPTCHA v3 (ReCaptchaV3Provider)');

      // Inicializar App Check com reCAPTCHA v3
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });

      console.log('✅ App Check inicializado com reCAPTCHA v3');
      
      // Verificar se o App Check está funcionando
      setTimeout(async () => {
        console.log('🔍 Verificando status do App Check...');
        
        try {
          // Tentar obter um token do App Check
          const { getToken } = await import('firebase/app-check');
          const token = await getToken(appCheck);
          
          // Verificar se é um token de debug
          const isDebug = isDebugToken(token.token);
          const tokenType = isDebug ? '🔧 DEBUG' : '🔒 PRODUÇÃO';
          
          console.log(`✅ Token do App Check obtido com sucesso (${tokenType}):`, token.token.substring(0, 20) + '...');
          
          if (isDebug) {
            console.log('⚠️  ATENÇÃO: Token de debug detectado!');
            console.log('   - Este token só funciona em desenvolvimento');
            console.log('   - Para produção, configure reCAPTCHA v3 no Firebase Console');
          }
        } catch (error) {
          console.error('❌ Erro ao obter token do App Check:', error);
          console.log('💡 Se houver erros 400, verifique:');
          console.log('   1. Site key está correta no Firebase Console?');
          console.log('   2. reCAPTCHA v3 está configurado para este domínio?');
          console.log('   3. App Check está habilitado no Firebase?');
          console.log('   4. Para desabilitar temporariamente: REACT_APP_DISABLE_APP_CHECK=true');
        }
      }, 2000);

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
  const siteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
                 process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                 process.env.RECAPTCHA_SITE_KEY;
  
  return process.env.NODE_ENV === 'production' && !!siteKey;
};

// Função para obter informações detalhadas do reCAPTCHA
export const getRecaptchaInfo = () => {
  const siteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
                 process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                 process.env.RECAPTCHA_SITE_KEY;
  
  const siteKeySource = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY ? 'REACT_APP_FIREBASE_APP_CHECK_SITE_KEY' :
                       process.env.REACT_APP_RECAPTCHA_SITE_KEY ? 'REACT_APP_RECAPTCHA_SITE_KEY' :
                       process.env.RECAPTCHA_SITE_KEY ? 'RECAPTCHA_SITE_KEY' : 'nenhuma';
  
  return {
    siteKey: siteKey || null,
    siteKeySource,
    provider: 'reCAPTCHA v3 (ReCaptchaV3Provider)',
    isConfigured: !!siteKey,
    environment: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isAppCheckEnabled: process.env.NODE_ENV === 'production' && !!siteKey
  };
};

// Função para verificar se é um token de debug
export const isDebugToken = (token: string): boolean => {
  // Tokens de debug do Firebase App Check começam com "debug:" ou são muito curtos
  return token.startsWith('debug:') || token.length < 20;
};

// Configurações do App Check
export const APP_CHECK_CONFIG = {
  // Site key do reCAPTCHA v3 (configurar no Firebase Console)
  SITE_KEY: process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
            process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
            process.env.RECAPTCHA_SITE_KEY,
  
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
