import { getToken } from 'firebase/app-check';

/**
 * Serviço para gerenciar o Firebase App Check
 * Fornece proteção contra abuso e ataques automatizados
 */
export class AppCheckService {
  private static instance: AppCheckService;
  private appCheck: any;

  private constructor() {
    try {
      // O App Check é inicializado automaticamente no firebase.ts
      // Aqui verificamos se está disponível na window
      this.appCheck = (window as any).appCheck;
    } catch (error) {
      console.warn('App Check não está configurado:', error);
    }
  }

  /**
   * Singleton para garantir uma única instância do serviço
   */
  public static getInstance(): AppCheckService {
    if (!AppCheckService.instance) {
      AppCheckService.instance = new AppCheckService();
    }
    return AppCheckService.instance;
  }

  /**
   * Verifica se o App Check está disponível
   */
  public isAvailable(): boolean {
    const appCheck = (window as any).appCheck;
    
    if (appCheck && typeof appCheck === 'object') {
      if (typeof appCheck.getToken === 'function') {
        return true;
      } else {
        console.warn('⚠️ App Check sem método getToken');
        return false;
      }
    }
    
    return false;
  }

  /**
   * Obtém um token do App Check
   * Este token deve ser enviado com as requisições para o backend
   */
  public async getToken(): Promise<string | null> {
    const appCheck = (window as any).appCheck;
    
    if (!appCheck) {
      return null;
    }

    // Verificar se tem método getToken
    if (typeof appCheck.getToken !== 'function') {
      // Aguardar até 5 segundos para o getToken ficar disponível
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentAppCheck = (window as any).appCheck;
        if (currentAppCheck && typeof currentAppCheck.getToken === 'function') {
          return this.getTokenFromAppCheck(currentAppCheck);
        }
      }
      
      console.error('❌ App Check não funcionou após aguardar');
      return null;
    }

    return this.getTokenFromAppCheck(appCheck);
  }

  /**
   * Método auxiliar para obter token do App Check
   */
  private async getTokenFromAppCheck(appCheck: any): Promise<string | null> {
    try {
      const { token } = await getToken(appCheck);
      return token;
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
      return null;
    }
  }

  /**
   * Obtém um token do App Check com refresh automático
   */
  public async getTokenWithRefresh(): Promise<string | null> {
    const appCheck = (window as any).appCheck;
    
    if (!appCheck || typeof appCheck.getToken !== 'function') {
      return null;
    }

    try {
      const { token } = await getToken(appCheck, true);
      return token;
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      return null;
    }
  }

  /**
   * Verifica se o App Check está funcionando corretamente
   */
  public async testAppCheck(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('❌ Teste do App Check falhou:', error);
      return false;
    }
  }
}

// Exportar instância singleton
export const appCheckService = AppCheckService.getInstance();
