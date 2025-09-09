/**
 * Configuração do Firebase App Check
 * Este arquivo gerencia as configurações específicas do App Check
 */

// Configuração para desenvolvimento
export const APP_CHECK_CONFIG = {
  // Token de debug para desenvolvimento (apenas para localhost)
  DEBUG_TOKEN: process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN,
  
  // Site key do reCAPTCHA v3 - Hardcoded para garantir funcionamento
  RECAPTCHA_SITE_KEY: '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras',
  
  // Chave secreta do reCAPTCHA (apenas para referência - não usar no frontend)
  RECAPTCHA_SECRET_KEY: process.env.REACT_APP_RECAPTCHA_SECRET_KEY,
  
  // Configurações de ambiente
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Configurações de refresh automático
  AUTO_REFRESH: true,
  
  // Configurações de timeout
  TOKEN_TIMEOUT: 60000, // 1 minuto
};

// Validação das configurações necessárias
export const validateAppCheckConfig = (): boolean => {
  const errors: string[] = [];
  
  if (!APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY) {
    errors.push('REACT_APP_RECAPTCHA_SITE_KEY não está configurado no Cloudflare Pages');
  }
  
  if (APP_CHECK_CONFIG.IS_DEVELOPMENT && !APP_CHECK_CONFIG.DEBUG_TOKEN) {
    console.warn('⚠️ Debug token não configurado para desenvolvimento');
  }
  
  if (errors.length > 0) {
    console.error('❌ App Check não configurado:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
  
  return true;
};

// Configurações específicas para diferentes ambientes
export const getEnvironmentConfig = () => {
  if (APP_CHECK_CONFIG.IS_DEVELOPMENT) {
    return {
      enableDebugToken: true,
      logLevel: 'debug' as const,
      autoRefresh: true,
    };
  }
  
  if (APP_CHECK_CONFIG.IS_PRODUCTION) {
    return {
      enableDebugToken: false,
      logLevel: 'error' as const,
      autoRefresh: true,
    };
  }
  
  return {
    enableDebugToken: false,
    logLevel: 'info' as const,
    autoRefresh: true,
  };
};

