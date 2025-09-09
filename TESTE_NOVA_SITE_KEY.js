// 🧪 Teste da Nova Site Key
// Cole este código no console para testar

console.log('🧪 TESTANDO NOVA SITE KEY\n');

const novaSiteKey = '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras';

console.log('Site Key:', novaSiteKey);
console.log('Domínio atual:', window.location.hostname);

if (typeof window.grecaptcha !== 'undefined') {
  console.log('✅ reCAPTCHA carregado');
  
  window.grecaptcha.ready(() => {
    console.log('✅ reCAPTCHA pronto');
    
    window.grecaptcha.execute(novaSiteKey, { action: 'test' })
      .then(token => {
        console.log('✅ NOVA SITE KEY FUNCIONOU!');
        console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
        console.log('Token completo:', token);
        
        // Agora testar App Check
        console.log('\n🛡️ TESTANDO APP CHECK:');
        const appCheck = window.appCheck;
        if (appCheck && typeof appCheck.getToken === 'function') {
          console.log('✅ App Check funcionando!');
          appCheck.getToken()
            .then(({ token: appCheckToken }) => {
              console.log('✅ Token App Check:', appCheckToken ? 'Válido' : 'Vazio');
            });
        } else {
          console.log('❌ App Check não funcionando');
        }
      })
      .catch(error => {
        console.error('❌ NOVA SITE KEY FALHOU:', error.message);
        console.log('Possíveis causas:');
        console.log('1. Domínio não autorizado no reCAPTCHA Admin');
        console.log('2. Site Key incorreta');
        console.log('3. reCAPTCHA não configurado corretamente');
      });
  });
} else {
  console.log('❌ reCAPTCHA não carregado');
}
