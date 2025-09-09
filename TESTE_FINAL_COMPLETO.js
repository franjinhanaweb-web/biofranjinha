// 🔍 Teste Final Completo - App Check
// Cole este código no console para diagnóstico completo

console.log('🔍 TESTE FINAL COMPLETO - APP CHECK\n');

// 1. Verificar variáveis de ambiente
console.log('📋 1. VARIÁVEIS DE AMBIENTE:');
console.log('REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || '❌ NÃO CONFIGURADA');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NÃO DEFINIDO');
console.log('');

// 2. Verificar reCAPTCHA
console.log('🤖 2. RECAPTCHA:');
console.log('grecaptcha disponível:', typeof window.grecaptcha !== 'undefined' ? '✅ SIM' : '❌ NÃO');

if (typeof window.grecaptcha !== 'undefined') {
  console.log('reCAPTCHA carregado:', window.grecaptcha);
  console.log('Métodos:', Object.keys(window.grecaptcha));
  
  // Testar reCAPTCHA
  window.grecaptcha.ready(() => {
    console.log('✅ reCAPTCHA está pronto');
    
    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras';
    console.log('Testando reCAPTCHA com Site Key:', siteKey);
    
    window.grecaptcha.execute(siteKey, { action: 'test' })
      .then(token => {
        console.log('✅ reCAPTCHA funcionou!');
        console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
      })
      .catch(error => {
        console.error('❌ reCAPTCHA falhou:', error.message);
      });
  });
}
console.log('');

// 3. Verificar App Check
console.log('🛡️ 3. APP CHECK:');
console.log('App Check na window:', window.appCheck || '❌ NÃO ENCONTRADO');

if (window.appCheck) {
  console.log('Tipo:', typeof window.appCheck);
  console.log('Constructor:', window.appCheck.constructor.name);
  console.log('Propriedades:', Object.keys(window.appCheck));
  console.log('getToken:', typeof window.appCheck.getToken === 'function' ? '✅ SIM' : '❌ NÃO');
  
  // Testar getToken
  if (typeof window.appCheck.getToken === 'function') {
    console.log('✅ Testando getToken...');
    window.appCheck.getToken()
      .then(({ token }) => {
        console.log('✅ Token obtido:', token ? 'Token válido' : 'Token vazio');
        if (token) {
          console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
        }
      })
      .catch(error => {
        console.error('❌ Erro ao obter token:', error);
      });
  }
}
console.log('');

// 4. Verificar Firebase
console.log('🔥 4. FIREBASE:');
console.log('Firebase app:', window.firebase || '❌ NÃO ENCONTRADO');
if (window.firebase) {
  console.log('Firebase config:', window.firebase.app()?.options || '❌ NÃO CONFIGURADO');
}
console.log('');

// 5. Verificar Network
console.log('🌐 5. VERIFICAÇÃO DE REDE:');
console.log('Verifique no Network tab se há:');
console.log('- Requisições para recaptcha (status 200)');
console.log('- Requisições para firebase (status 200)');
console.log('- Erros 403/404/500');
console.log('');

// 6. Resumo final
console.log('📊 RESUMO FINAL:');
const issues = [];
if (!process.env.REACT_APP_RECAPTCHA_SITE_KEY) issues.push('Site Key não configurada');
if (typeof window.grecaptcha === 'undefined') issues.push('reCAPTCHA não carregado');
if (!window.appCheck) issues.push('App Check não inicializado');
if (window.appCheck && typeof window.appCheck.getToken !== 'function') issues.push('getToken não disponível');

if (issues.length === 0) {
  console.log('✅ TUDO FUNCIONANDO!');
} else {
  console.log('❌ PROBLEMAS ENCONTRADOS:');
  issues.forEach(issue => console.log(`- ${issue}`));
}

console.log('\n🔍 TESTE FINAL CONCLUÍDO!');
