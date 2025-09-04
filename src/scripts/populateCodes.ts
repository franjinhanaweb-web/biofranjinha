// Script para popular a coleção users_codes com códigos UUID
// Execute este script com: npx ts-node src/scripts/populateCodes.ts

import { populateVerificationCodes, listVerificationCodes } from '../utils/populateVerificationCodes';

async function main() {
  try {
    console.log('🔧 Script de População de Códigos de Verificação');
    console.log('================================================');
    
    // Listar códigos existentes primeiro
    console.log('\n📊 Verificando códigos existentes...');
    await listVerificationCodes();
    
    // Perguntar se quer continuar
    console.log('\n❓ Deseja criar 50 novos códigos? (y/n)');
    
    // Para execução automática, vamos criar os códigos diretamente
    // Em um ambiente interativo, você pode usar readline para perguntar ao usuário
    const shouldCreate = true; // Mude para false se não quiser criar automaticamente
    
    if (shouldCreate) {
      console.log('\n🚀 Criando 50 códigos de verificação...');
      await populateVerificationCodes(50);
      
      console.log('\n📊 Listando códigos após criação...');
      await listVerificationCodes();
      
      console.log('\n✅ Script executado com sucesso!');
      console.log('💡 Agora você pode testar o cadastro com qualquer um desses códigos.');
    } else {
      console.log('❌ Operação cancelada pelo usuário.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante execução do script:', error);
    process.exit(1);
  }
}

// Executar o script
main().then(() => {
  console.log('\n🏁 Script finalizado.');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erro fatal:', error);
  process.exit(1);
});
