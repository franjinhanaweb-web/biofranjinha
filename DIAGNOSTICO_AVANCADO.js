// 🔍 Diagnóstico Avançado do App Check
// Cole este código no console do navegador para investigar o problema

console.log('🔍 DIAGNÓSTICO AVANÇADO DO APP CHECK\n');

// 1. Verificar variáveis de ambiente
console.log('📋 1. VARIÁVEIS DE AMBIENTE:');
console.log('REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_APP_CHECK_DEBUG_TOKEN:', process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN || '❌ NÃO CONFIGURADA');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NÃO DEFINIDO');
console.log('');

// 2. Verificar Firebase
console.log('🔥 2. FIREBASE:');
console.log('Firebase app:', window.firebase || '❌ NÃO ENCONTRADO');
if (window.firebase) {
  console.log('Firebase config:', window.firebase.app()?.options || '❌ NÃO CONFIGURADO');
}
console.log('');

// 3. Verificar App Check detalhadamente
console.log('🛡️ 3. APP CHECK DETALHADO:');
console.log('App Check na window:', window.appCheck || '❌ NÃO ENCONTRADO');

if (window.appCheck) {
  console.log('Tipo:', typeof window.appCheck);
  console.log('Constructor:', window.appCheck.constructor.name);
  console.log('Propriedades:', Object.keys(window.appCheck));
  console.log('Prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.appCheck)));
  console.log('Tem getToken?', typeof window.appCheck.getToken === 'function' ? '✅ SIM' : '❌ NÃO');
  
  // Verificar se é uma instância válida
  if (window.appCheck.constructor.name === 'AppCheck') {
    console.log('✅ É uma instância válida do App Check');
  } else {
    console.log('❌ NÃO é uma instância válida do App Check');
    console.log('Tipo esperado: AppCheck, Tipo atual:', window.appCheck.constructor.name);
  }
} else {
  console.log('❌ App Check não foi inicializado');
}
console.log('');

// 4. Verificar reCAPTCHA
console.log('🤖 4. RECAPTCHA:');
console.log('reCAPTCHA carregado:', typeof window.grecaptcha !== 'undefined' ? '✅ SIM' : '❌ NÃO');
if (window.grecaptcha) {
  console.log('reCAPTCHA v3 disponível:', typeof window.grecaptcha.ready === 'function' ? '✅ SIM' : '❌ NÃO');
  console.log('reCAPTCHA sitekey:', window.grecaptcha.sitekey || '❌ NÃO DEFINIDO');
}
console.log('');

// 5. Verificar erros de rede
console.log('🌐 5. VERIFICAÇÃO DE REDE:');
console.log('Verifique no Network tab se há:');
console.log('- Requisições para recaptcha (status 200)');
console.log('- Requisições para firebase (status 200)');
console.log('- Erros 403/404/500');
console.log('');

// 6. Teste de funcionalidade avançado
console.log('🧪 6. TESTE AVANÇADO:');
if (window.appCheck && typeof window.appCheck.getToken === 'function') {
  console.log('✅ App Check está funcionando!');
  console.log('Tentando obter token...');
  
  window.appCheck.getToken()
    .then(({ token }) => {
      console.log('✅ Token obtido:', token ? 'Token válido' : 'Token vazio');
      if (token) {
        console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
      }
    })
    .catch(error => {
      console.error('❌ Erro ao obter token:', error);
      console.log('Detalhes do erro:', error.message);
    });
} else {
  console.log('❌ App Check não está funcionando');
  console.log('Possíveis causas:');
  console.log('1. App Check não configurado no Firebase Console');
  console.log('2. reCAPTCHA não configurado ou Site Key incorreta');
  console.log('3. Domínio não autorizado no reCAPTCHA');
  console.log('4. Variáveis de ambiente incorretas');
  console.log('5. Problema de timing na inicialização');
}
console.log('');

// 7. Verificar configuração do Firebase Console
console.log('🔧 7. VERIFICAÇÃO DO FIREBASE CONSOLE:');
console.log('Verifique se no Firebase Console:');
console.log('1. App Check está habilitado');
console.log('2. reCAPTCHA v3 está configurado');
console.log('3. Site Key está correta');
console.log('4. Domínios estão autorizados');
console.log('5. Não há erros de configuração');
console.log('');

// 8. Resumo final
console.log('📊 RESUMO FINAL:');
const issues = [];
if (!process.env.REACT_APP_RECAPTCHA_SITE_KEY) issues.push('Site Key não configurada');
if (!window.appCheck) issues.push('App Check não inicializado');
if (window.appCheck && typeof window.appCheck.getToken !== 'function') issues.push('getToken não disponível');
if (typeof window.grecaptcha === 'undefined') issues.push('reCAPTCHA não carregado');
if (window.appCheck && window.appCheck.constructor.name !== 'AppCheck') issues.push('Instância inválida do App Check');

if (issues.length === 0) {
  console.log('✅ TUDO CONFIGURADO CORRETAMENTE!');
} else {
  console.log('❌ PROBLEMAS ENCONTRADOS:');
  issues.forEach(issue => console.log(`- ${issue}`));
}
console.log('');

console.log('🔍 DIAGNÓSTICO AVANÇADO CONCLUÍDO!');
console.log('Se ainda houver problemas, verifique:');
console.log('1. Firebase Console → App Check → Configuração');
console.log('2. Google reCAPTCHA → Domínios autorizados');
console.log('3. Cloudflare Pages → Environment Variables');
console.log('4. Network tab → Erros de requisição');
