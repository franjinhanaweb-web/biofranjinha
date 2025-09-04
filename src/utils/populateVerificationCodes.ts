import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Função para gerar UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Interface para o documento de código
interface VerificationCodeDoc {
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: Timestamp;
  createdAt: Timestamp;
}

// Função para popular a coleção com códigos
export const populateVerificationCodes = async (quantity: number = 50): Promise<void> => {
  try {
    console.log(`🚀 Iniciando criação de ${quantity} códigos de verificação...`);
    
    const codesRef = collection(db, 'users_codes');
    const codes: VerificationCodeDoc[] = [];
    
    // Gerar códigos únicos
    const generatedCodes = new Set<string>();
    
    while (generatedCodes.size < quantity) {
      const code = generateUUID();
      generatedCodes.add(code);
    }
    
    // Preparar documentos para inserção
    const now = Timestamp.now();
    const codesArray = Array.from(generatedCodes);
    for (const code of codesArray) {
      codes.push({
        code: code,
        isUsed: false,
        createdAt: now
      });
    }
    
    // Inserir códigos em lotes (Firebase permite até 500 por lote)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    let totalInserted = 0;
    
    for (const batch of batches) {
      const promises = batch.map(codeDoc => addDoc(codesRef, codeDoc));
      await Promise.all(promises);
      totalInserted += batch.length;
      console.log(`✅ Lote inserido: ${totalInserted}/${quantity} códigos`);
    }
    
    console.log(`🎉 Sucesso! ${totalInserted} códigos de verificação foram criados na coleção 'users_codes'`);
    console.log('📋 Códigos gerados:');
    
    // Mostrar alguns exemplos dos códigos criados
    const sampleCodes = Array.from(generatedCodes).slice(0, 5);
    sampleCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code}`);
    });
    
    if (generatedCodes.size > 5) {
      console.log(`   ... e mais ${generatedCodes.size - 5} códigos`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar códigos de verificação:', error);
    throw error;
  }
};

// Função para limpar todos os códigos (cuidado!)
export const clearAllVerificationCodes = async (): Promise<void> => {
  try {
    console.log('⚠️  ATENÇÃO: Esta função irá deletar TODOS os códigos da coleção users_codes!');
    console.log('Para usar esta função, descomente o código abaixo e execute manualmente.');
    
    // Descomente as linhas abaixo se quiser usar esta função
    /*
    const codesRef = collection(db, 'users_codes');
    const querySnapshot = await getDocs(codesRef);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('🗑️  Todos os códigos foram removidos da coleção users_codes');
    */
  } catch (error) {
    console.error('❌ Erro ao limpar códigos:', error);
    throw error;
  }
};

// Função para listar códigos existentes
export const listVerificationCodes = async (): Promise<void> => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const codesRef = collection(db, 'users_codes');
    const querySnapshot = await getDocs(codesRef);
    
    console.log(`📊 Total de códigos na coleção: ${querySnapshot.size}`);
    
    if (querySnapshot.size > 0) {
      console.log('📋 Códigos existentes:');
      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        const status = data.isUsed ? '🔴 USADO' : '🟢 DISPONÍVEL';
        console.log(`   ${index + 1}. ${data.code} - ${status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar códigos:', error);
    throw error;
  }
};
