// Script de build para Cloudflare Pages
// Substitui variáveis de ambiente no arquivo env.js

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo env.js
const envJsPath = path.join(__dirname, '../public/env.js');

// Ler o arquivo env.js
let envJsContent = fs.readFileSync(envJsPath, 'utf8');

// Substituir variáveis de ambiente
envJsContent = envJsContent.replace('%%RECAPTCHA_SITE_KEY%%', process.env.RECAPTCHA_SITE_KEY || '');

// Escrever o arquivo atualizado
fs.writeFileSync(envJsPath, envJsContent);

console.log('✅ Variáveis de ambiente substituídas no env.js');
console.log('🔑 RECAPTCHA_SITE_KEY:', process.env.RECAPTCHA_SITE_KEY ? 'Configurada' : 'Não encontrada');
