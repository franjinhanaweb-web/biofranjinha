#!/usr/bin/env node

/**
 * Script para testar configuração do App Check
 * Execute com: node scripts/test-app-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testando configuração do App Check...\n');

// Verificar arquivos de configuração
const configFiles = [
  'src/services/appCheckService.ts',
  'src/config/environment.ts',
  'src/config/firebase.ts'
];

console.log('📁 Verificando arquivos de configuração:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Arquivo não encontrado`);
  }
});

// Verificar variáveis de ambiente
console.log('\n🔧 Verificando variáveis de ambiente:');
const envVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_RECAPTCHA_SITE_KEY'
];

envVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} - Configurada`);
  } else {
    console.log(`❌ ${envVar} - Não configurada`);
  }
});

// Verificar se App Check está desabilitado
if (process.env.REACT_APP_DISABLE_APP_CHECK === 'true') {
  console.log('\n⚠️  App Check está DESABILITADO via REACT_APP_DISABLE_APP_CHECK');
}

// Verificar ambiente
console.log(`\n🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);

// Verificar se é produção
if (process.env.NODE_ENV === 'production') {
  console.log('✅ App Check será inicializado em produção');
} else {
  console.log('ℹ️  App Check será desabilitado em desenvolvimento');
}

console.log('\n📋 Próximos passos:');
console.log('1. Configure REACT_APP_RECAPTCHA_SITE_KEY no Cloudflare Pages');
console.log('2. Habilite App Check no Firebase Console');
console.log('3. Faça redeploy do projeto');
console.log('4. Teste a aplicação');

console.log('\n🔗 Links úteis:');
console.log('- Google reCAPTCHA Console: https://www.google.com/recaptcha/admin');
console.log('- Firebase Console: https://console.firebase.google.com');
console.log('- Cloudflare Pages: https://dash.cloudflare.com');
