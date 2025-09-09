// 🔍 DIAGNÓSTICO COMPLETO DO APP CHECK
// Cole este código no console do navegador (F12) para diagnosticar o problema

console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DO APP CHECK\n');

// 1. Verificar se o reCAPTCHA está carregado
console.log('1️⃣ VERIFICANDO RECAPTCHA:');
if (typeof window.grecaptcha !== 'undefined') {
  console.log('✅ reCAPTCHA carregado');
  console.log('   - Versão:', window.grecaptcha.version || 'desconhecida');
} else {
  console.log('❌ reCAPTCHA NÃO carregado');
  console.log('   - Verifique se o script do reCAPTCHA está no HTML');
}

// 2. Verificar variáveis de ambiente
console.log('\n2️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE:');
const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras';
console.log('   - Site Key:', siteKey);
console.log('   - Domínio atual:', window.location.hostname);

// 3. Verificar se o App Check existe
console.log('\n3️⃣ VERIFICANDO APP CHECK:');
if (window.appCheck) {
  console.log('✅ App Check existe');
  console.log('   - Tipo:', typeof window.appCheck);
  console.log('   - Métodos disponíveis:', Object.getOwnPropertyNames(window.appCheck));
  
  if (typeof window.appCheck.getToken === 'function') {
    console.log('✅ Método getToken disponível');
  } else {
    console.log('❌ Método getToken NÃO disponível');
  }
} else {
  console.log('❌ App Check NÃO existe');
}

// 4. Testar reCAPTCHA
console.log('\n4️⃣ TESTANDO RECAPTCHA:');
if (typeof window.grecaptcha !== 'undefined') {
  window.grecaptcha.ready(() => {
    console.log('✅ reCAPTCHA pronto');
    
    window.grecaptcha.execute(siteKey, { action: 'test' })
      .then(token => {
        console.log('✅ reCAPTCHA funcionando!');
        console.log('   - Token (primeiros 20 chars):', token.substring(0, 20) + '...');
        
        // 5. Testar App Check
        console.log('\n5️⃣ TESTANDO APP CHECK:');
        if (window.appCheck && typeof window.appCheck.getToken === 'function') {
          window.appCheck.getToken()
            .then(({ token: appCheckToken }) => {
              if (appCheckToken) {
                console.log('✅ APP CHECK FUNCIONANDO!');
                console.log('   - Token App Check (primeiros 20 chars):', appCheckToken.substring(0, 20) + '...');
                console.log('   - Token completo:', appCheckToken);
              } else {
                console.log('❌ Token App Check vazio');
              }
            })
            .catch(error => {
              console.error('❌ ERRO ao obter token App Check:', error);
              console.log('   - Código do erro:', error.code);
              console.log('   - Mensagem:', error.message);
            });
        } else {
          console.log('❌ App Check não disponível ou sem método getToken');
        }
      })
      .catch(error => {
        console.error('❌ ERRO no reCAPTCHA:', error);
        console.log('   - Código do erro:', error.code);
        console.log('   - Mensagem:', error.message);
        console.log('\n🔧 POSSÍVEIS CAUSAS:');
        console.log('   1. Domínio não autorizado no reCAPTCHA Admin');
        console.log('   2. Site Key incorreta');
        console.log('   3. reCAPTCHA não configurado corretamente');
        console.log('   4. Problema de rede ou CORS');
      });
  });
} else {
  console.log('❌ Não é possível testar reCAPTCHA - não está carregado');
}

// 6. Verificar configuração do Firebase
console.log('\n6️⃣ VERIFICANDO FIREBASE:');
if (window.firebase) {
  console.log('✅ Firebase carregado');
} else {
  console.log('❌ Firebase não carregado');
}

// 7. Verificar se há erros no console
console.log('\n7️⃣ VERIFICANDO ERROS:');
console.log('   - Verifique se há erros vermelhos no console');
console.log('   - Procure por mensagens de "App Check" ou "reCAPTCHA"');

// 8. Instruções para resolver
console.log('\n8️⃣ PRÓXIMOS PASSOS:');
console.log('   1. Se reCAPTCHA falhou: Verifique domínio no reCAPTCHA Admin');
console.log('   2. Se App Check não existe: Verifique inicialização no firebase.ts');
console.log('   3. Se App Check existe mas sem getToken: Problema na configuração');
console.log('   4. Se tudo falhou: Verifique Firebase Console - App Check');

console.log('\n🎯 DIAGNÓSTICO CONCLUÍDO!');
console.log('   - Copie os resultados e me envie para análise');
