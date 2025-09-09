// 🔍 Script de Diagnóstico do App Check
// Cole este código no console do navegador para diagnosticar problemas

console.log('🔍 INICIANDO DIAGNÓSTICO DO APP CHECK...\n');

// 1. Verificar variáveis de ambiente
console.log('📋 1. VARIÁVEIS DE AMBIENTE:');
console.log('REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || '❌ NÃO CONFIGURADA');
console.log('REACT_APP_APP_CHECK_DEBUG_TOKEN:', process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN || '❌ NÃO CONFIGURADA');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NÃO DEFINIDO');
console.log('');

// 2. Verificar Firebase
console.log('🔥 2. FIREBASE:');
console.log('Firebase app:', window.firebase || '❌ NÃO ENCONTRADO');
console.log('Firebase config:', window.firebase?.app()?.options || '❌ NÃO CONFIGURADO');
console.log('');

// 3. Verificar App Check
console.log('🛡️ 3. APP CHECK:');
console.log('App Check na window:', window.appCheck || '❌ NÃO ENCONTRADO');
if (window.appCheck) {
  console.log('Tipo:', typeof window.appCheck);
  console.log('Propriedades:', Object.keys(window.appCheck));
  console.log('Métodos:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.appCheck)));
  console.log('Tem getToken?', typeof window.appCheck.getToken === 'function' ? '✅ SIM' : '❌ NÃO');
} else {
  console.log('❌ App Check não foi inicializado');
}
console.log('');

// 4. Verificar reCAPTCHA
console.log('🤖 4. RECAPTCHA:');
console.log('reCAPTCHA carregado:', typeof window.grecaptcha !== 'undefined' ? '✅ SIM' : '❌ NÃO');
if (window.grecaptcha) {
  console.log('reCAPTCHA v3 disponível:', typeof window.grecaptcha.ready === 'function' ? '✅ SIM' : '❌ NÃO');
}
console.log('');

// 5. Verificar erros no console
console.log('🚨 5. ERROS RECENTES:');
console.log('Verifique se há erros vermelhos acima relacionados a:');
console.log('- Firebase App Check');
console.log('- reCAPTCHA');
console.log('- Variáveis de ambiente');
console.log('');

// 6. Teste de funcionalidade
console.log('🧪 6. TESTE DE FUNCIONALIDADE:');
if (window.appCheck && typeof window.appCheck.getToken === 'function') {
  console.log('✅ App Check está funcionando!');
  console.log('Tentando obter token...');
  
  window.appCheck.getToken()
    .then(({ token }) => {
      console.log('✅ Token obtido:', token ? 'Token válido' : 'Token vazio');
    })
    .catch(error => {
      console.error('❌ Erro ao obter token:', error);
    });
} else {
  console.log('❌ App Check não está funcionando');
  console.log('Possíveis causas:');
  console.log('1. App Check não configurado no Firebase Console');
  console.log('2. reCAPTCHA não configurado');
  console.log('3. Variáveis de ambiente incorretas');
  console.log('4. Domínio não autorizado');
}
console.log('');

// 7. Resumo
console.log('📊 RESUMO DO DIAGNÓSTICO:');
const issues = [];
if (!process.env.REACT_APP_RECAPTCHA_SITE_KEY) issues.push('Site Key não configurada');
if (!window.appCheck) issues.push('App Check não inicializado');
if (window.appCheck && typeof window.appCheck.getToken !== 'function') issues.push('getToken não disponível');
if (typeof window.grecaptcha === 'undefined') issues.push('reCAPTCHA não carregado');

if (issues.length === 0) {
  console.log('✅ TUDO CONFIGURADO CORRETAMENTE!');
} else {
  console.log('❌ PROBLEMAS ENCONTRADOS:');
  issues.forEach(issue => console.log(`- ${issue}`));
}
console.log('');

console.log('🔍 DIAGNÓSTICO CONCLUÍDO!');
console.log('Se houver problemas, siga o guia DIAGNOSTICO_COMPLETO_APP_CHECK.md');
