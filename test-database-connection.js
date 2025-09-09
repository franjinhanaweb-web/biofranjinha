// Script para testar conexão com banco específico
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Para teste local, vamos usar valores hardcoded temporariamente
// Em produção no Cloudflare, essas variáveis são injetadas automaticamente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Substitua pela sua API key
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "biodefranja.firebaseapp.com", // Substitua pelo seu domínio
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "biodefranja", // Substitua pelo seu project ID
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "biodefranja.appspot.com", // Substitua pelo seu bucket
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789", // Substitua pelo seu sender ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef", // Substitua pelo seu app ID
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX" // Substitua pelo seu measurement ID
};

async function testDatabaseConnection() {
  try {
    console.log('=== TESTE DE CONEXÃO COM BANCO BIODEFRANJA ===');
    console.log('Project ID:', firebaseConfig.projectId);
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    console.log('Firebase inicializado');
    
    // Testar conexão com banco específico
    console.log('Tentando conectar com banco biodefranja...');
    const db = getFirestore(app, 'biodefranja');
    console.log('Banco biodefranja configurado');
    
    // Testar leitura de uma coleção
    console.log('Testando leitura da coleção Codes_biosite...');
    const codesRef = collection(db, 'Codes_biosite');
    const snapshot = await getDocs(codesRef);
    
    console.log('✅ Sucesso! Códigos encontrados:', snapshot.size);
    
    if (snapshot.size > 0) {
      console.log('Primeiros códigos:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ${data.code} - Usado: ${data.isUsed}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === 'invalid-argument') {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verificar se o banco "biodefranja" existe no Firebase Console');
      console.log('2. Verificar se as regras foram deployadas para este banco');
      console.log('3. Verificar se o projeto está configurado corretamente');
    }
  }
}

testDatabaseConnection();
