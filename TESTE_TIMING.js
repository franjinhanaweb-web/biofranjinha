// ⏱️ Teste de Timing do App Check
// Cole este código no console para verificar se é problema de timing

console.log('⏱️ TESTE DE TIMING DO APP CHECK\n');

let attempts = 0;
const maxAttempts = 20;

function checkAppCheck() {
  attempts++;
  const appCheck = window.appCheck;
  
  console.log(`Tentativa ${attempts}/${maxAttempts}:`);
  console.log('App Check:', appCheck ? '✅ Encontrado' : '❌ Não encontrado');
  
  if (appCheck) {
    console.log('Tipo:', typeof appCheck);
    console.log('Constructor:', appCheck.constructor.name);
    console.log('getToken:', typeof appCheck.getToken === 'function' ? '✅ SIM' : '❌ NÃO');
    
    if (typeof appCheck.getToken === 'function') {
      console.log('🎉 App Check funcionando!');
      return true;
    }
  }
  
  if (attempts < maxAttempts) {
    console.log('Aguardando 500ms...\n');
    setTimeout(checkAppCheck, 500);
  } else {
    console.log('❌ App Check não funcionou após 10 segundos');
    console.log('Possíveis causas:');
    console.log('1. Configuração incorreta no Firebase Console');
    console.log('2. Site Key incorreta ou domínio não autorizado');
    console.log('3. Problema de rede ou CORS');
    console.log('4. reCAPTCHA não carregado corretamente');
  }
}

console.log('Iniciando teste de timing...\n');
checkAppCheck();
