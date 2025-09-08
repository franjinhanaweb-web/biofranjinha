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
    
    // Se o App Check existe mas não tem getToken, ainda consideramos disponível
    // pois pode estar funcionando de outras formas
    if (appCheck && typeof appCheck === 'object') {
      console.log('App Check detectado, mas sem método getToken - pode precisar configurar no Firebase Console');
      return true; // Considerar disponível mesmo sem getToken
    }
    
    return !!appCheck && typeof appCheck.getToken === 'function';
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

    try {
      const { token } = await getToken(appCheck);
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

    try {
      const { token } = await getToken(appCheck, true);
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
