// 🧪 TESTE AVANÇADO DO RECAPTCHA E APP CHECK
// Cole este código no console para testar tudo

console.log('🧪 TESTE AVANÇADO DO RECAPTCHA E APP CHECK\n');

// Site Key atual - Hardcoded
const siteKey = '6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras';

// 1. Verificar se o reCAPTCHA está carregado
console.log('1️⃣ VERIFICANDO RECAPTCHA:');
console.log('   - grecaptcha existe?', typeof window.grecaptcha !== 'undefined');
console.log('   - Site Key:', siteKey);
console.log('   - Domínio:', window.location.hostname);

if (typeof window.grecaptcha !== 'undefined') {
  console.log('   - Versão:', window.grecaptcha.version || 'desconhecida');
  console.log('   - Métodos disponíveis:', Object.getOwnPropertyNames(window.grecaptcha));
} else {
  console.log('❌ reCAPTCHA não carregado!');
  console.log('   - Verifique se o script está no HTML:');
  console.log('   - <script src="https://www.google.com/recaptcha/api.js?render=' + siteKey + '"></script>');
}

// 2. Testar reCAPTCHA
if (typeof window.grecaptcha !== 'undefined') {
  console.log('\n2️⃣ TESTANDO RECAPTCHA:');
  
  window.grecaptcha.ready(() => {
    console.log('✅ reCAPTCHA pronto');
    
    // Testar com diferentes ações
    const actions = ['test', 'homepage', 'submit', 'login'];
    let testCount = 0;
    
    const testAction = (action) => {
      console.log(`   - Testando ação: ${action}`);
      
      window.grecaptcha.execute(siteKey, { action })
        .then(token => {
          testCount++;
          console.log(`   ✅ Ação ${action}: Sucesso`);
          console.log(`   - Token (primeiros 20 chars): ${token.substring(0, 20)}...`);
          
          if (testCount === actions.length) {
            console.log('\n✅ TODOS OS TESTES DO RECAPTCHA PASSARAM!');
            testAppCheck();
          }
        })
        .catch(error => {
          testCount++;
          console.error(`   ❌ Ação ${action}: Falhou`);
          console.error(`   - Erro: ${error.message}`);
          console.error(`   - Código: ${error.code}`);
          
          if (testCount === actions.length) {
            console.log('\n❌ ALGUNS TESTES DO RECAPTCHA FALHARAM');
            console.log('   - Verifique se o domínio está autorizado no reCAPTCHA Admin');
            testAppCheck();
          }
        });
    };
    
    // Executar todos os testes
    actions.forEach(testAction);
  });
} else {
  console.log('\n❌ Não é possível testar reCAPTCHA - não está carregado');
  testAppCheck();
}

// 3. Testar App Check
function testAppCheck() {
  console.log('\n3️⃣ TESTANDO APP CHECK:');
  
  if (window.appCheck) {
    console.log('✅ App Check existe');
    console.log('   - Tipo:', typeof window.appCheck);
    console.log('   - Métodos:', Object.getOwnPropertyNames(window.appCheck));
    
    if (typeof window.appCheck.getToken === 'function') {
      console.log('✅ Método getToken disponível');
      
      // Testar obter token
      window.appCheck.getToken()
        .then(({ token }) => {
          if (token) {
            console.log('✅ TOKEN APP CHECK OBTIDO!');
            console.log('   - Token (primeiros 20 chars):', token.substring(0, 20) + '...');
            console.log('   - Token completo:', token);
            console.log('   - Tamanho:', token.length, 'caracteres');
            
            // Verificar se o token parece válido
            if (token.length > 50 && token.includes('.')) {
              console.log('✅ Token parece válido (formato JWT)');
            } else {
              console.log('⚠️ Token pode estar inválido (formato estranho)');
            }
          } else {
            console.log('❌ Token App Check vazio');
          }
        })
        .catch(error => {
          console.error('❌ ERRO ao obter token App Check:');
          console.error('   - Erro:', error.message);
          console.error('   - Código:', error.code);
          console.error('   - Stack:', error.stack);
        });
    } else {
      console.log('❌ Método getToken NÃO disponível');
      console.log('   - App Check pode não estar inicializado corretamente');
    }
  } else {
    console.log('❌ App Check NÃO existe');
    console.log('   - Verifique se o App Check foi inicializado no firebase.ts');
  }
}

// 4. Verificar configuração do Firebase
console.log('\n4️⃣ VERIFICANDO FIREBASE:');
if (window.firebase) {
  console.log('✅ Firebase carregado');
} else {
  console.log('❌ Firebase não carregado');
}

// 5. Verificar variáveis de ambiente
console.log('\n5️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE:');
console.log('   - REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'não definida');
console.log('   - NODE_ENV:', process.env.NODE_ENV || 'não definida');

// 6. Instruções de resolução
console.log('\n6️⃣ INSTRUÇÕES DE RESOLUÇÃO:');
console.log('   Se reCAPTCHA falhou:');
console.log('   1. Acesse https://www.google.com/recaptcha/admin');
console.log('   2. Verifique se o domínio está autorizado');
console.log('   3. Verifique se a Site Key está correta');
console.log('');
console.log('   Se App Check falhou:');
console.log('   1. Acesse https://console.firebase.google.com/');
console.log('   2. Vá em "Build" → "App Check"');
console.log('   3. Configure o App Check para seu app web');
console.log('   4. Use a mesma Site Key do reCAPTCHA');

console.log('\n🎯 TESTE CONCLUÍDO!');
console.log('   - Copie os resultados e me envie para análise');
