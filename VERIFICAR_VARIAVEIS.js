// 🔍 Verificar Variáveis de Ambiente
// Cole este código no console para verificar as variáveis

console.log('🔍 VERIFICANDO VARIÁVEIS DE AMBIENTE:\n');

// Verificar todas as variáveis do Firebase
console.log('📋 FIREBASE:');
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_FIREBASE_APP_ID:', process.env.REACT_APP_FIREBASE_APP_ID || '❌ NÃO CONFIGURADA');
console.log('');

// Verificar variáveis do App Check
console.log('🛡️ APP CHECK:');
console.log('REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_APP_CHECK_DEBUG_TOKEN:', process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN || '❌ NÃO CONFIGURADA');
console.log('');

// Verificar outras variáveis
console.log('🌐 OUTRAS:');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NÃO DEFINIDO');
console.log('REACT_APP_ENV:', process.env.REACT_APP_ENV || '❌ NÃO DEFINIDO');
console.log('');

// Verificar se está usando fallback
console.log('🔧 CONFIGURAÇÃO ATUAL:');
console.log('Site Key sendo usada:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras (fallback)');
console.log('');

// Resumo
const missingVars = [];
if (!process.env.REACT_APP_FIREBASE_API_KEY) missingVars.push('REACT_APP_FIREBASE_API_KEY');
if (!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN) missingVars.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
if (!process.env.REACT_APP_FIREBASE_APP_ID) missingVars.push('REACT_APP_FIREBASE_APP_ID');
if (!process.env.REACT_APP_RECAPTCHA_SITE_KEY) missingVars.push('REACT_APP_RECAPTCHA_SITE_KEY');

if (missingVars.length === 0) {
  console.log('✅ TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS!');
} else {
  console.log('❌ VARIÁVEIS FALTANDO:');
  missingVars.forEach(variable => console.log(`  - ${variable}`));
  console.log('\n📋 Configure no Cloudflare Pages:');
  console.log('1. Acesse Cloudflare Dashboard');
  console.log('2. Vá para Pages → Seu Projeto → Settings');
  console.log('3. Clique em Environment Variables');
  console.log('4. Adicione as variáveis faltando');
  console.log('5. Faça um redeploy');
}
