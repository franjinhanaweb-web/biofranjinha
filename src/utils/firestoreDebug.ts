import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Função para testar a conexão com o Firestore
export const testFirestoreConnection = async () => {
  try {
    console.log('🔍 Testando conexão com Firestore...');
    
    // Teste simples de escrita
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      timestamp: new Date(),
      message: 'Teste de conexão'
    });
    
    console.log('✅ Firestore: Escrita funcionando');
    
    // Teste de leitura
    const testDocRead = await getDoc(testDoc);
    if (testDocRead.exists()) {
      console.log('✅ Firestore: Leitura funcionando');
      console.log('📄 Dados lidos:', testDocRead.data());
    } else {
      console.log('❌ Firestore: Documento não encontrado');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Erro na conexão com Firestore:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    return false;
  }
};

// Função para testar a coleção users_site especificamente
export const testUsersSiteCollection = async () => {
  try {
    console.log('🔍 Testando coleção users_site...');
    
    const testUserDoc = doc(db, 'users_site', 'test-user-123');
    await setDoc(testUserDoc, {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Usuário Teste',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        theme: 'light'
      }
    });
    
    console.log('✅ Coleção users_site: Escrita funcionando');
    
    // Ler o documento
    const userDocRead = await getDoc(testUserDoc);
    if (userDocRead.exists()) {
      console.log('✅ Coleção users_site: Leitura funcionando');
      console.log('📄 Dados do usuário:', userDocRead.data());
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Erro na coleção users_site:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    return false;
  }
};
