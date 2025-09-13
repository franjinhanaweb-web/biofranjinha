import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { sessionService } from '../services/sessionService';

export interface SessionState {
  isAuthenticated: boolean;
  hasSession: boolean;
  isLoading: boolean;
  user: User | null;
}

export const useSession = () => {
  const [state, setState] = useState<SessionState>({
    isAuthenticated: false,
    hasSession: false,
    isLoading: true,
    user: null,
  });

  // Verificar sessão no servidor
  const checkServerSession = useCallback(async () => {
    try {
      const hasSession = await sessionService.checkSession();
      setState(prev => ({ ...prev, hasSession }));
      return hasSession;
    } catch (error) {
      console.error('Erro ao verificar sessão no servidor:', error);
      return false;
    }
  }, []);

  // Criar sessão no servidor
  const createServerSession = useCallback(async () => {
    try {
      const success = await sessionService.createSession();
      if (success) {
        setState(prev => ({ ...prev, hasSession: true }));
      }
      return success;
    } catch (error) {
      console.error('Erro ao criar sessão no servidor:', error);
      return false;
    }
  }, []);

  // Fazer logout no servidor
  const logoutServerSession = useCallback(async () => {
    try {
      const success = await sessionService.logout();
      if (success) {
        setState(prev => ({ ...prev, hasSession: false }));
      }
      return success;
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
      return false;
    }
  }, []);

  // Renovar sessão
  const renewSession = useCallback(async () => {
    try {
      const success = await sessionService.renewSession();
      if (success) {
        setState(prev => ({ ...prev, hasSession: true }));
      }
      return success;
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
      return false;
    }
  }, []);

  // Sincronizar estado do Firebase Auth com sessão do servidor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 [AUTH] Estado do Firebase Auth mudou:', !!user);
      
      setState(prev => ({
        ...prev,
        isAuthenticated: !!user,
        user,
        isLoading: false,
      }));

      if (user) {
        // Usuário logado - verificar se há sessão no servidor
        console.log('✅ [AUTH] Usuário logado, verificando sessão no servidor...');
        const hasServerSession = await checkServerSession();
        
        if (!hasServerSession) {
          // Criar sessão no servidor
          console.log('🔄 [AUTH] Criando sessão no servidor...');
          await createServerSession();
        }
      } else {
        // Usuário deslogado - limpar sessão no servidor
        console.log('❌ [AUTH] Usuário deslogado, limpando sessão no servidor...');
        await logoutServerSession();
      }
    });

    return () => unsubscribe();
  }, [checkServerSession, createServerSession, logoutServerSession]);

  // Renovação automática de sessão
  useEffect(() => {
    if (!state.isAuthenticated || !state.hasSession) return;

    // Renovar a cada 19 horas (20% de 24h)
    const interval = setInterval(async () => {
      console.log('🔄 [RENEW] Renovação automática de sessão...');
      await renewSession();
    }, 19 * 60 * 60 * 1000); // 19 horas em millisegundos

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.hasSession, renewSession]);

  return {
    ...state,
    checkServerSession,
    createServerSession,
    logoutServerSession,
    renewSession,
  };
};
