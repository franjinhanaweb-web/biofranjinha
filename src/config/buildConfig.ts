// Configurações de build para produção
export const BUILD_CONFIG = {
  // Desabilitar source maps em produção
  GENERATE_SOURCEMAP: process.env.NODE_ENV === 'production' ? false : true,
  
  // Configurações de segurança
  SECURITY: {
    ENABLE_MFA: process.env.REACT_APP_ENABLE_MFA === 'true',
    REQUIRE_EMAIL_VERIFICATION: process.env.REACT_APP_REQUIRE_EMAIL_VERIFICATION === 'true',
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS || '5'),
    LOCKOUT_DURATION: parseInt(process.env.REACT_APP_LOCKOUT_DURATION || '30'),
  },
  
  // Configurações de debug
  DEBUG: {
    ENABLED: process.env.REACT_APP_DEBUG === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'error'
  }
};

// Função para remover console.log em produção
export const removeConsoleInProduction = () => {
  // Só remover console.log se explicitamente habilitado
  const shouldRemoveConsole = process.env.REACT_APP_REMOVE_CONSOLE === 'true';
  
  if (process.env.NODE_ENV === 'production' && shouldRemoveConsole) {
    // Substituir console.log por função vazia
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    
    // Manter apenas console.error para logs críticos
    // console.error permanece ativo
    console.log('🔧 Console.log removido em produção');
  } else {
    console.log('🔧 Console.log mantido - use REACT_APP_REMOVE_CONSOLE=true para remover');
  }
};

// Função para remover debugger em produção
export const removeDebuggerInProduction = () => {
  if (process.env.NODE_ENV === 'production') {
    // Substituir debugger por função vazia
    (window as any).debugger = () => {};
  }
};

// Inicializar configurações de build
export const initializeBuildConfig = () => {
  removeConsoleInProduction();
  removeDebuggerInProduction();
  
  if (BUILD_CONFIG.DEBUG.ENABLED) {
    console.log('🔧 Modo debug ativado');
  }
};
