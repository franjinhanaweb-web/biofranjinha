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
    // Verificar se o App Check está disponível na window
    const appCheck = (window as any).appCheck;
    console.log('Verificando App Check:', appCheck);
    console.log('Tipo:', typeof appCheck);
    console.log('Tem getToken?', appCheck && typeof appCheck.getToken === 'function');
    
    // Verificar se é uma instância válida do App Check
    if (appCheck && typeof appCheck === 'object') {
      console.log('Propriedades do App Check:', Object.keys(appCheck));
      console.log('Métodos disponíveis:', Object.getOwnPropertyNames(Object.getPrototypeOf(appCheck)));
      
      // Verificar se tem getToken
      if (typeof appCheck.getToken === 'function') {
        console.log('✅ App Check está funcionando corretamente');
        return true;
      } else {
        console.warn('⚠️ App Check detectado, mas sem método getToken - pode precisar configurar no Firebase Console');
        return false; // Não considerar disponível sem getToken
      }
    }
    
    console.warn('❌ App Check não está configurado');
    return false;
  }

  /**
   * Obtém um token do App Check
   * Este token deve ser enviado com as requisições para o backend
   */
  public async getToken(): Promise<string | null> {
    const appCheck = (window as any).appCheck;
    
    if (!appCheck) {
      console.warn('App Check não está configurado');
      return null;
    }

    // Verificar se tem método getToken
    if (typeof appCheck.getToken !== 'function') {
      console.warn('App Check não tem método getToken - tentando aguardar...');
      
      // Aguardar até 5 segundos para o getToken ficar disponível
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentAppCheck = (window as any).appCheck;
        if (currentAppCheck && typeof currentAppCheck.getToken === 'function') {
          console.log('✅ getToken agora está disponível após aguardar');
          return this.getTokenFromAppCheck(currentAppCheck);
        }
      }
      
      console.error('❌ getToken não ficou disponível após aguardar');
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
      console.log('✅ Token obtido com sucesso:', token ? 'Token válido' : 'Token vazio');
      return token;
    } catch (error) {
      console.error('Erro ao obter token do App Check:', error);
      return null;
    }
  }

  /**
   * Obtém um token do App Check com refresh automático
   */
  public async getTokenWithRefresh(): Promise<string | null> {
    const appCheck = (window as any).appCheck;
    
    if (!appCheck) {
      console.warn('App Check não está configurado');
      return null;
    }

    // Verificar se tem método getToken
    if (typeof appCheck.getToken !== 'function') {
      console.warn('App Check não tem método getToken para refresh');
      return null;
    }

    try {
      const { token } = await getToken(appCheck, true);
      console.log('✅ Token renovado com sucesso:', token ? 'Token válido' : 'Token vazio');
      return token;
    } catch (error) {
      console.error('Erro ao obter token do App Check:', error);
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
      console.error('Teste do App Check falhou:', error);
      return false;
    }
  }
}

// Exportar instância singleton
export const appCheckService = AppCheckService.getInstance();
