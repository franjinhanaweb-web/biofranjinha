/**
 * Configuração do Firebase App Check
 * Este arquivo gerencia as configurações específicas do App Check
 */

// Configuração para desenvolvimento
export const APP_CHECK_CONFIG = {
  // Token de debug para desenvolvimento (apenas para localhost)
  DEBUG_TOKEN: process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN,
  
  // Site key do reCAPTCHA v3 - Deve ser configurada no Cloudflare
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  
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
    console.warn('⚠️ REACT_APP_APP_CHECK_DEBUG_TOKEN não configurado para desenvolvimento');
    console.warn('Configure no Cloudflare Pages para testes locais');
  }
  
  if (errors.length > 0) {
    console.error('❌ Erros de configuração do App Check:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('📋 Configure as variáveis no Cloudflare Pages:');
    console.error('  - REACT_APP_RECAPTCHA_SITE_KEY');
    console.error('  - REACT_APP_APP_CHECK_DEBUG_TOKEN (opcional para desenvolvimento)');
    return false;
  }
  
  console.log('✅ Configuração do App Check validada com sucesso');
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

