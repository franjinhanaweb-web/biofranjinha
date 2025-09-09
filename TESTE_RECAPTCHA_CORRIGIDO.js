// 🤖 Teste de reCAPTCHA - Versão Corrigida
// Cole este código no console para verificar se o reCAPTCHA está funcionando

console.log('🤖 TESTE DE RECAPTCHA - VERSÃO CORRIGIDA\n');

// 1. Verificar se reCAPTCHA está carregado
console.log('1. Verificando reCAPTCHA:');
console.log('grecaptcha disponível:', typeof window.grecaptcha !== 'undefined' ? '✅ SIM' : '❌ NÃO');

if (typeof window.grecaptcha !== 'undefined') {
  console.log('reCAPTCHA carregado:', window.grecaptcha);
  console.log('Métodos disponíveis:', Object.keys(window.grecaptcha));
  
  // 2. Verificar se tem o método ready
  if (typeof window.grecaptcha.ready === 'function') {
    console.log('✅ reCAPTCHA v3 está disponível');
    
    // 3. Testar o reCAPTCHA
    window.grecaptcha.ready(() => {
      console.log('✅ reCAPTCHA está pronto');
      
      // 4. Verificar se tem o método execute
      if (typeof window.grecaptcha.execute === 'function') {
        console.log('✅ Método execute disponível');
        
        // 5. Tentar executar o reCAPTCHA
        const siteKey = '6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z'; // Site Key hardcoded para teste
        console.log('Site Key:', siteKey);
        
        window.grecaptcha.execute(siteKey, { action: 'test' })
          .then(token => {
            console.log('✅ reCAPTCHA executado com sucesso!');
            console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
            console.log('Token completo:', token);
            
            // 6. Agora testar se o App Check funciona
            console.log('\n🛡️ TESTANDO APP CHECK APÓS RECAPTCHA:');
            const appCheck = window.appCheck;
            if (appCheck && typeof appCheck.getToken === 'function') {
              console.log('✅ App Check agora tem getToken!');
              appCheck.getToken()
                .then(({ token: appCheckToken }) => {
                  console.log('✅ Token do App Check obtido:', appCheckToken ? 'Token válido' : 'Token vazio');
                  if (appCheckToken) {
                    console.log('Token App Check (primeiros 20 chars):', appCheckToken.substring(0, 20) + '...');
                  }
                })
                .catch(error => {
                  console.error('❌ Erro ao obter token do App Check:', error);
                });
            } else {
              console.log('❌ App Check ainda não tem getToken');
            }
          })
          .catch(error => {
            console.error('❌ Erro ao executar reCAPTCHA:', error);
            console.log('Possíveis causas:');
            console.log('1. Site Key incorreta');
            console.log('2. Domínio não autorizado');
            console.log('3. reCAPTCHA não configurado corretamente');
          });
      } else {
        console.log('❌ Método execute não disponível');
      }
    });
  } else {
    console.log('❌ reCAPTCHA v3 não está disponível');
  }
} else {
  console.log('❌ reCAPTCHA não foi carregado');
  console.log('Verifique se:');
  console.log('1. O script do reCAPTCHA está sendo carregado');
  console.log('2. Não há erros de rede');
  console.log('3. O domínio está autorizado');
}

console.log('\n🔍 Verificando Network tab:');
console.log('Procure por requisições para:');
console.log('- recaptcha/api.js');
console.log('- recaptcha/api2/anchor');
console.log('- recaptcha/api2/reload');
console.log('Status deve ser 200 (sucesso)');
