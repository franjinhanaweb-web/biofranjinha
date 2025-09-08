/**
 * Utilitário para testar o App Check
 * Simula diferentes cenários para verificar se a proteção está funcionando
 */

import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export class AppCheckTester {
  /**
   * Teste 1: Acesso normal (deve funcionar)
   */
  static async testNormalAccess() {
    try {
      console.log('🧪 Testando acesso normal...');
      const testCollection = collection(db, 'test-appcheck');
      const snapshot = await getDocs(testCollection);
      
      console.log('✅ Acesso normal funcionou!');
      return {
        success: true,
        message: 'Acesso normal permitido',
        documents: snapshot.size
      };
    } catch (error: any) {
      console.log('❌ Acesso normal falhou:', error.message);
      return {
        success: false,
        message: `Erro no acesso normal: ${error.message}`,
        error: error.code
      };
    }
  }

  /**
   * Teste 2: Múltiplas requisições rápidas (rate limiting)
   */
  static async testRateLimiting() {
    console.log('🧪 Testando rate limiting...');
    const promises = [];
    
    // Fazer 10 requisições simultâneas
    for (let i = 0; i < 10; i++) {
      promises.push(
        getDocs(collection(db, 'test-appcheck'))
          .then(() => ({ success: true, index: i }))
          .catch((error) => ({ success: false, index: i, error: error.message }))
      );
    }

    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📊 Resultado: ${successful} sucessos, ${failed} falhas`);
    
    return {
      success: failed > 0, // Se algumas falharam, o rate limiting está funcionando
      message: `Rate limiting: ${successful} sucessos, ${failed} falhas`,
      details: results
    };
  }

  /**
   * Teste 3: Tentativa de escrita sem permissão
   */
  static async testWritePermission() {
    try {
      console.log('🧪 Testando permissão de escrita...');
      const testCollection = collection(db, 'test-appcheck');
      
      // Tentar adicionar um documento
      const docRef = await addDoc(testCollection, {
        test: 'App Check Test',
        timestamp: new Date(),
        source: 'app-check-tester'
      });
      
      console.log('✅ Escrita permitida!');
      
      // Limpar o documento de teste
      await deleteDoc(docRef);
      
      return {
        success: true,
        message: 'Escrita permitida e documento limpo',
        docId: docRef.id
      };
    } catch (error: any) {
      console.log('❌ Escrita bloqueada:', error.message);
      return {
        success: false,
        message: `Escrita bloqueada: ${error.message}`,
        error: error.code
      };
    }
  }

  /**
   * Teste 4: Simular token inválido
   */
  static async testInvalidToken() {
    try {
      console.log('🧪 Testando com token inválido...');
      
      // Temporariamente desabilitar App Check
      const originalAppCheck = (window as any).appCheck;
      (window as any).appCheck = null;
      
      const testCollection = collection(db, 'test-appcheck');
      await getDocs(testCollection);
      
      // Restaurar App Check
      (window as any).appCheck = originalAppCheck;
      
      return {
        success: false,
        message: '❌ App Check deveria ter bloqueado acesso sem token!'
      };
    } catch (error: any) {
      console.log('✅ App Check bloqueou acesso sem token!');
      
      // Restaurar App Check
      (window as any).appCheck = originalAppCheck;
      
      return {
        success: true,
        message: 'App Check bloqueou acesso sem token (correto!)',
        error: error.code
      };
    }
  }

  /**
   * Executar todos os testes
   */
  static async runAllTests() {
    console.log('🚀 Iniciando testes do App Check...');
    
    const results = {
      normalAccess: await this.testNormalAccess(),
      rateLimiting: await this.testRateLimiting(),
      writePermission: await this.testWritePermission(),
      invalidToken: await this.testInvalidToken()
    };

    console.log('📊 Resultados dos testes:', results);
    return results;
  }
}

export default AppCheckTester;
