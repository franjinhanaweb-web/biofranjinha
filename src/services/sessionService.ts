import { auth } from '../config/firebase';

export interface SessionResponse {
  ok: boolean;
  message?: string;
}

export interface CheckResponse {
  ok: boolean;
  hasSession: boolean;
}

class SessionService {
  private baseUrl = '/auth'; // Ajuste conforme sua configuração

  /**
   * Criar sessão trocando Firebase ID Token por Session Cookie
   */
  async createSession(): Promise<boolean> {
    try {
      console.log('🔄 [SESSION] Iniciando criação de sessão...');
      
      // Verificar se há usuário logado
      const user = auth.currentUser;
      if (!user) {
        console.error('❌ [SESSION] Nenhum usuário logado');
        throw new Error('Usuário não está logado');
      }

      // Obter ID Token do Firebase
      console.log('🔄 [SESSION] Obtendo ID Token do Firebase...');
      const idToken = await user.getIdToken(true); // true = force refresh
      console.log('✅ [SESSION] ID Token obtido:', !!idToken);

      // Chamar endpoint para criar sessão
      console.log('🔄 [SESSION] Chamando endpoint /auth/session...');
      const response = await fetch(`${this.baseUrl}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify({ idToken }),
      });

      console.log('📡 [SESSION] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [SESSION] Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Erro ao criar sessão');
      }

      const data: SessionResponse = await response.json();
      console.log('✅ [SESSION] Sessão criada com sucesso:', data);
      
      return data.ok;
    } catch (error) {
      console.error('❌ [SESSION] Erro ao criar sessão:', error);
      throw error;
    }
  }

  /**
   * Fazer logout removendo Session Cookie
   */
  async logout(): Promise<boolean> {
    try {
      console.log('🔄 [LOGOUT] Iniciando logout...');
      
      // Chamar endpoint para logout
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log('📡 [LOGOUT] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [LOGOUT] Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Erro ao fazer logout');
      }

      const data: SessionResponse = await response.json();
      console.log('✅ [LOGOUT] Logout realizado com sucesso:', data);
      
      return data.ok;
    } catch (error) {
      console.error('❌ [LOGOUT] Erro ao fazer logout:', error);
      throw error;
    }
  }

  /**
   * Verificar se existe sessão ativa
   */
  async checkSession(): Promise<boolean> {
    try {
      console.log('🔄 [CHECK] Verificando sessão...');
      
      const response = await fetch(`${this.baseUrl}/check`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log('📡 [CHECK] Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ [CHECK] Erro na resposta:', response.status);
        return false;
      }

      const data: CheckResponse = await response.json();
      console.log('📋 [CHECK] Status da sessão:', data);
      
      return data.ok && data.hasSession;
    } catch (error) {
      console.error('❌ [CHECK] Erro ao verificar sessão:', error);
      return false;
    }
  }

  /**
   * Renovar sessão automaticamente
   */
  async renewSession(): Promise<boolean> {
    try {
      console.log('🔄 [RENEW] Renovando sessão...');
      return await this.createSession();
    } catch (error) {
      console.error('❌ [RENEW] Erro ao renovar sessão:', error);
      return false;
    }
  }
}

// Exportar instância singleton
export const sessionService = new SessionService();
export default sessionService;
