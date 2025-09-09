// Script de teste para verificar validação de código
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const testCode = '70373ba3-4c1c-4a1b-938c-d6f85ad11044';

async function testCodeValidation() {
  try {
    console.log('=== TESTE DE VALIDAÇÃO DE CÓDIGO ===');
    console.log('Código para testar:', testCode);
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'biodefranja');
    
    console.log('Firebase inicializado com sucesso');
    
    // Testar regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidFormat = testCode.length === 36 && uuidRegex.test(testCode);
    console.log('Formato UUID válido:', isValidFormat);
    
    // Buscar código na coleção
    console.log('Buscando código na coleção Codes_biosite...');
    const codesRef = collection(db, 'Codes_biosite');
    const q = query(codesRef, where('code', '==', testCode));
    const querySnapshot = await getDocs(q);
    
    console.log('Resultado da busca:');
    console.log('- Documentos encontrados:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('❌ Código NÃO encontrado no banco de dados');
      
      // Listar alguns códigos para debug
      console.log('\n--- Listando alguns códigos existentes ---');
      const allCodesRef = collection(db, 'Codes_biosite');
      const allSnapshot = await getDocs(allCodesRef);
      console.log('Total de códigos na coleção:', allSnapshot.size);
      
      allSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`Código ${index + 1}:`, data.code, '- Usado:', data.isUsed);
      });
    } else {
      const codeDoc = querySnapshot.docs[0];
      const codeData = { id: codeDoc.id, ...codeDoc.data() };
      console.log('✅ Código encontrado!');
      console.log('Dados do código:', JSON.stringify(codeData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
  }
}

testCodeValidation();
