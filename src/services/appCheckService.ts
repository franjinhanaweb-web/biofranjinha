import { getToken } from 'firebase/app-check';
import app from '../config/firebase';

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
      // Aqui apenas verificamos se está disponível
      this.appCheck = app; // Usar a instância do app diretamente
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
    return !!this.appCheck;
  }

  /**
   * Obtém um token do App Check
   * Este token deve ser enviado com as requisições para o backend
   */
  public async getToken(): Promise<string | null> {
    if (!this.appCheck) {
      console.warn('App Check não está configurado');
      return null;
    }

    try {
      const { token } = await getToken(this.appCheck);
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
    if (!this.appCheck) {
      console.warn('App Check não está configurado');
      return null;
    }

    try {
      const { token } = await getToken(this.appCheck, true);
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
