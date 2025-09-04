// Utilitário para controlar DevTools e proteções de desenvolvimento
import { protectSourceCode } from './sourceProtection';

let sourceProtectionEnabled = false;

// Habilitar proteção do código fonte
export const enableSourceProtection = () => {
  if (!sourceProtectionEnabled) {
    protectSourceCode();
    sourceProtectionEnabled = true;
    console.log('🛡️ Proteção do código fonte habilitada');
  }
};

// Desabilitar proteção do código fonte
export const disableSourceProtection = () => {
  if (sourceProtectionEnabled) {
    // Recarregar a página para remover todas as proteções
    console.log('🔓 Proteção do código fonte desabilitada - recarregando página...');
    window.location.reload();
  }
};

// Verificar se a proteção está ativa
export const isSourceProtectionEnabled = (): boolean => {
  return sourceProtectionEnabled;
};

// Função para alternar proteção baseada no ambiente
export const toggleSourceProtectionByEnvironment = () => {
  const forceProtection = process.env.REACT_APP_ENABLE_SOURCE_PROTECTION === 'true';
  const disableProtection = process.env.REACT_APP_DISABLE_SOURCE_PROTECTION === 'true';
  
  // Só ativar proteção se explicitamente habilitada
  if (disableProtection) {
    console.log('🔧 Proteção do código fonte desabilitada por variável de ambiente');
    return;
  }
  
  if (forceProtection) {
    enableSourceProtection();
  } else {
    console.log('🔧 Proteção do código fonte desabilitada - use REACT_APP_ENABLE_SOURCE_PROTECTION=true para ativar');
  }
};

// Função para habilitar DevTools (desenvolvimento)
export const enableDevTools = () => {
  // Remover qualquer bloqueio de console
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  };
  
  // Restaurar console original
  Object.assign(console, originalConsole);
  
  // Remover bloqueios de teclado
  document.removeEventListener('keydown', () => {});
  
  // Remover bloqueios de mouse
  document.removeEventListener('contextmenu', () => {});
  document.removeEventListener('selectstart', () => {});
  
  console.log('🔧 DevTools habilitados para desenvolvimento');
};

// Função para desabilitar DevTools (produção)
export const disableDevTools = () => {
  enableSourceProtection();
  console.log('🛡️ DevTools desabilitados para produção');
};
