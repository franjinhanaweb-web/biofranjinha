// Configurações de ambiente e variáveis
export const ENV_CONFIG = {
  // Ambiente atual
  NODE_ENV: process.env.NODE_ENV,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Firebase
  FIREBASE: {
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  },
  
  // App Check / reCAPTCHA
  APP_CHECK: {
    SITE_KEY: process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
              process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
              process.env.RECAPTCHA_SITE_KEY,
    ENABLED: process.env.NODE_ENV === 'production' && 
             !!(process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY || 
                process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                process.env.RECAPTCHA_SITE_KEY)
  },
  
  // Segurança
  SECURITY: {
    ENABLE_MFA: process.env.REACT_APP_ENABLE_MFA === 'true',
    REQUIRE_EMAIL_VERIFICATION: process.env.REACT_APP_REQUIRE_EMAIL_VERIFICATION === 'true',
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS || '5'),
    LOCKOUT_DURATION: parseInt(process.env.REACT_APP_LOCKOUT_DURATION || '30'),
  },
  
  // Debug
  DEBUG: {
    ENABLED: process.env.REACT_APP_DEBUG === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'error'
  }
};

// Função para verificar se todas as variáveis necessárias estão configuradas
export const validateEnvironment = (): { isValid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  // Verificar variáveis obrigatórias do Firebase
  if (!ENV_CONFIG.FIREBASE.API_KEY) missing.push('REACT_APP_FIREBASE_API_KEY');
  if (!ENV_CONFIG.FIREBASE.AUTH_DOMAIN) missing.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
  if (!ENV_CONFIG.FIREBASE.PROJECT_ID) missing.push('REACT_APP_FIREBASE_PROJECT_ID');
  if (!ENV_CONFIG.FIREBASE.STORAGE_BUCKET) missing.push('REACT_APP_FIREBASE_STORAGE_BUCKET');
  if (!ENV_CONFIG.FIREBASE.MESSAGING_SENDER_ID) missing.push('REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
  if (!ENV_CONFIG.FIREBASE.APP_ID) missing.push('REACT_APP_FIREBASE_APP_ID');
  
  // Verificar App Check em produção
  if (ENV_CONFIG.IS_PRODUCTION && !ENV_CONFIG.APP_CHECK.SITE_KEY) {
    missing.push('RECAPTCHA_SITE_KEY (ou REACT_APP_RECAPTCHA_SITE_KEY)');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

// Função para log de configuração (apenas em desenvolvimento)
export const logEnvironmentConfig = () => {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.log('🔧 Configuração de Ambiente:');
    console.log('- NODE_ENV:', ENV_CONFIG.NODE_ENV);
    console.log('- Firebase configurado:', !!ENV_CONFIG.FIREBASE.API_KEY);
    console.log('- App Check configurado:', ENV_CONFIG.APP_CHECK.ENABLED);
    console.log('- Site Key encontrada:', !!ENV_CONFIG.APP_CHECK.SITE_KEY);
    
    const validation = validateEnvironment();
    if (!validation.isValid) {
      console.warn('⚠️ Variáveis de ambiente faltando:', validation.missing);
    } else {
      console.log('✅ Todas as variáveis de ambiente configuradas');
    }
  }
};
