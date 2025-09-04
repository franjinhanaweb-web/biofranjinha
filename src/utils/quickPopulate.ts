// Script rápido para popular códigos - execute no console do navegador
// Cole este código no console do navegador na página do seu app

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

// Função para criar códigos rapidamente
async function quickPopulateCodes(quantity: number = 50) {
  console.log(`🚀 Criando ${quantity} códigos de verificação...`);
  
  const codesRef = collection(db, 'users_codes');
  const codes = [];
  
  // Gerar códigos únicos
  const generatedCodes = new Set<string>();
  while (generatedCodes.size < quantity) {
    generatedCodes.add(generateUUID());
  }
  
  // Preparar documentos
  const now = Timestamp.now();
  const codesArray = Array.from(generatedCodes);
  
  for (const code of codesArray) {
    codes.push({
      code: code,
      isUsed: false,
      createdAt: now
    });
  }
  
  // Inserir códigos
  let inserted = 0;
  for (const codeDoc of codes) {
    try {
      await addDoc(codesRef, codeDoc);
      inserted++;
      if (inserted % 10 === 0) {
        console.log(`✅ ${inserted}/${quantity} códigos inseridos...`);
      }
    } catch (error) {
      console.error('❌ Erro ao inserir código:', error);
    }
  }
  
  console.log(`🎉 Sucesso! ${inserted} códigos criados.`);
  console.log('📋 Exemplos de códigos criados:');
  codesArray.slice(0, 5).forEach((code, index) => {
    console.log(`   ${index + 1}. ${code}`);
  });
  
  return codesArray;
}

// Executar automaticamente
quickPopulateCodes(50).then(codes => {
  console.log('✅ Script executado com sucesso!');
  console.log('💡 Agora você pode testar o cadastro com qualquer um desses códigos.');
}).catch(error => {
  console.error('❌ Erro:', error);
});
