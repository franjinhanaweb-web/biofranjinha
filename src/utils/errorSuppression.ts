import { suppressNetworkRequests } from './networkSuppression';
import { protectSourceCode } from './sourceProtection';

// Utilitário para suprimir erros específicos do console
export const suppressNetworkErrors = () => {
  // Primeiro, suprimir as requisições de rede
  suppressNetworkRequests();
  
  // Adicionar proteção do código fonte
  protectSourceCode();
  // Salvar a função original do console.error
  const originalError = console.error;
  
  // Substituir console.error por uma versão filtrada
  console.error = (...args: any[]) => {
    // Verificar se é um erro de rede bloqueado pelo cliente
    const errorMessage = args.join(' ');
    
    // Lista de erros que devem ser suprimidos
    const suppressedErrors = [
      'net::ERR_BLOCKED_BY_CLIENT',
      'ERR_BLOCKED_BY_CLIENT',
      'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
      'POST https://firestore.googleapis.com',
      'GET https://firestore.googleapis.com'
    ];
    
    // Verificar se o erro deve ser suprimido
    const shouldSuppress = suppressedErrors.some(suppressedError => 
      errorMessage.includes(suppressedError)
    );
    
    // Se não deve ser suprimido, mostrar o erro normalmente
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };
  
  // Também suprimir erros de rede no window.onerror
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const errorString = String(message);
    
    // Verificar se é um erro de rede que deve ser suprimido
    const shouldSuppress = errorString.includes('ERR_BLOCKED_BY_CLIENT') ||
                          errorString.includes('net::ERR_BLOCKED_BY_CLIENT');
    
    if (shouldSuppress) {
      return true; // Previne o erro de aparecer no console
    }
    
    // Se não for um erro suprimido, usar o handler original
    if (originalOnError) {
      return originalOnError.call(window, message, source, lineno, colno, error);
    }
    
    return false;
  };
  
  // Suprimir erros de Promise rejeitadas relacionadas a rede
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    const errorMessage = event.reason?.message || String(event.reason);
    
    // Verificar se é um erro de rede que deve ser suprimido
    const shouldSuppress = errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
                          errorMessage.includes('net::ERR_BLOCKED_BY_CLIENT') ||
                          errorMessage.includes('Failed to fetch');
    
    if (shouldSuppress) {
      event.preventDefault(); // Previne o erro de aparecer no console
      return;
    }
    
    // Se não for um erro suprimido, usar o handler original
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };
};

// Função para restaurar o console original (útil para debug)
export const restoreConsole = () => {
  // Esta função pode ser chamada se precisar restaurar o console original
  // Por enquanto, não implementamos pois queremos manter a supressão
};
