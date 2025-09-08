# 🔍 Diagnóstico: Token não está sendo gerado

## 1. 📱 **Verificar Console do Navegador (F12)**

### **Abra o DevTools e procure por:**

#### **✅ Mensagens de SUCESSO:**
```
Inicializando App Check...
Site Key: 6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z
✅ App Check inicializado com sucesso!
Provider: JC {...}
```

#### **❌ Mensagens de ERRO:**
```
⚠️ App Check não foi inicializado - RECAPTCHA_SITE_KEY não encontrado
❌ Erro ao inicializar App Check: [erro específico]
App Check não está configurado ou disponível
```

## 2. 🔥 **Verificar Firebase Console**

### **Acesse:** https://console.firebase.google.com/

#### **Verificar se App Check está configurado:**
1. **"Build" → "App Check"**
2. Deve mostrar seu app web
3. Status deve ser "Ativo"

#### **Se NÃO estiver configurado:**
1. Clique em **"Get started"**
2. Selecione seu app web
3. Configure reCAPTCHA v3/Enterprise
4. Site Key: `6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z`
5. Secret Key: `6LfWqsIrAAAAAE_81IOXglswLlqx5m63fdqAc97H`

## 3. 🧪 **Teste Manual no Console**

### **Abra o console do navegador (F12) e digite:**

```javascript
// Verificar se App Check existe
console.log('App Check:', window.appCheck);

// Tentar obter token manualmente
if (window.appCheck) {
  window.appCheck.getToken().then(token => {
    console.log('Token obtido:', token);
  }).catch(error => {
    console.error('Erro ao obter token:', error);
  });
} else {
  console.error('App Check não está disponível');
}
```

## 4. 🔧 **Problemas Comuns e Soluções**

### **Problema 1: "App Check não está configurado"**
- **Causa:** Não configurado no Firebase Console
- **Solução:** Configure no Firebase Console

### **Problema 2: "reCAPTCHA_SITE_KEY não encontrado"**
- **Causa:** Chave não configurada
- **Solução:** Já está configurada no código

### **Problema 3: "Erro ao inicializar App Check"**
- **Causa:** Configuração incorreta no Firebase
- **Solução:** Verificar configuração no Firebase Console

### **Problema 4: "Missing or insufficient permissions"**
- **Causa:** Regras do Firestore
- **Solução:** Já corrigidas

## 5. 🎯 **Passo a Passo para Resolver**

### **Passo 1: Verificar Console**
- Abra F12 → Console
- Procure por mensagens de erro
- Anote o erro específico

### **Passo 2: Configurar Firebase Console**
- Acesse Firebase Console
- Configure App Check
- Ative para Firestore

### **Passo 3: Testar Novamente**
- Recarregue a página
- Execute teste manual no console
- Verifique se token é gerado

### **Passo 4: Se ainda não funcionar**
- Verifique se domínio está correto
- Aguarde alguns minutos para propagação
- Teste em modo incógnito

## 6. 📊 **Checklist de Diagnóstico**

- [ ] Console mostra inicialização com sucesso?
- [ ] App Check configurado no Firebase Console?
- [ ] reCAPTCHA configurado corretamente?
- [ ] Domínio adicionado no reCAPTCHA?
- [ ] Regras do Firestore publicadas?
- [ ] Teste manual no console funciona?

## 7. 🆘 **Se nada funcionar**

### **Teste em modo de desenvolvimento:**
1. Adicione token de debug no Firebase Console
2. Configure variável de ambiente: `REACT_APP_APP_CHECK_DEBUG_TOKEN=debug-token-123`
3. Teste novamente

**Me diga qual erro aparece no console para eu te ajudar melhor!** 🚀
