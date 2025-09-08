# 🔍 Como Verificar se o App Check Está Funcionando

## 1. 📱 **Console do Navegador (F12)**

### **Passo a passo:**
1. Abra seu site: `https://seu-dominio.pages.dev`
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **"Console"**
4. Procure por estas mensagens:

### **✅ Mensagens que indicam SUCESSO:**
```
Inicializando App Check...
Site Key: 6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z
✅ App Check inicializado com sucesso!
Provider: JC {...}
```

### **❌ Mensagens que indicam PROBLEMA:**
```
⚠️ App Check não foi inicializado - RECAPTCHA_SITE_KEY não encontrado
❌ Erro ao inicializar App Check: [erro]
App Check não está configurado ou disponível
```

---

## 2. 🧪 **Página de Testes**

### **Acesse:** `https://seu-dominio.pages.dev/app-check-demo`

### **Teste 1: "Testar App Check"**
- **✅ Sucesso:** "App Check funcionando corretamente!"
- **❌ Falha:** "Falha ao obter token do App Check"

### **Teste 2: "Testes Avançados"**
Execute os 4 testes e verifique:

#### **✅ Resultados CORRETOS:**
- **Acesso Normal:** ✅ Sucesso
- **Rate Limiting:** ⚠️ Algumas falhas (proteção funcionando)
- **Permissão de Escrita:** ✅ Sucesso
- **Token Inválido:** ✅ Bloqueado (correto!)

#### **❌ Resultados PROBLEMÁTICOS:**
- **Acesso Normal:** ❌ "Missing or insufficient permissions"
- **Permissão de Escrita:** ❌ "Missing or insufficient permissions"
- **Token Inválido:** ❌ "Passou" (perigoso!)

---

## 3. 🔥 **Firebase Console**

### **Acesse:** https://console.firebase.google.com/

### **Verificar configuração:**
1. **"Build" → "App Check"**
2. Deve mostrar seu app web configurado
3. Provider: reCAPTCHA v3
4. Status: Ativo

### **Verificar métricas:**
1. **"App Check" → "Metrics"**
2. Deve mostrar:
   - **Solicitações válidas** > 0
   - **Solicitações inválidas** (bots bloqueados)
   - **Gráficos de tráfego**

---

## 4. 🛡️ **Teste de Proteção Real**

### **Teste 1: Acesso sem App Check**
1. Abra o console do navegador
2. Digite: `window.appCheck = null`
3. Tente acessar o Firestore
4. **Deve falhar** com erro de permissão

### **Teste 2: Múltiplas requisições**
1. Execute "Testes Avançados"
2. Verifique se algumas requisições falham
3. **Isso é bom** - indica rate limiting

### **Teste 3: Token expirado**
1. Aguarde 1 hora
2. Tente acessar dados
3. **Deve renovar automaticamente**

---

## 5. 📊 **Indicadores de Sucesso**

### **✅ App Check FUNCIONANDO:**
- Console mostra inicialização com sucesso
- Página de testes retorna tokens válidos
- Firebase Console mostra métricas
- Acesso sem token é bloqueado
- Rate limiting ativo

### **❌ App Check NÃO FUNCIONANDO:**
- Console mostra erros de inicialização
- Página de testes falha
- Firebase Console não mostra métricas
- Acesso sem token funciona (perigoso!)
- Sem rate limiting

---

## 6. 🚨 **Problemas Comuns e Soluções**

### **"Falha ao obter token do App Check"**
- **Causa:** App Check não configurado no Firebase Console
- **Solução:** Configure seguindo `FIREBASE_APP_CHECK_SETUP.md`

### **"Missing or insufficient permissions"**
- **Causa:** Regras do Firestore muito restritivas
- **Solução:** Já corrigido nas regras atuais

### **"App Check não está configurado"**
- **Causa:** Erro na inicialização
- **Solução:** Verifique as credenciais do reCAPTCHA

### **Rate limiting não funciona**
- **Causa:** Configuração incorreta
- **Solução:** Verifique as configurações do Firebase

---

## 7. 🎯 **Checklist Final**

- [ ] Console mostra "✅ App Check inicializado com sucesso!"
- [ ] Página de testes retorna tokens válidos
- [ ] Firebase Console mostra métricas
- [ ] Acesso sem token é bloqueado
- [ ] Rate limiting funciona
- [ ] Tokens renovam automaticamente
- [ ] Proteção ativa no Firestore

**Se todos os itens estiverem ✅, seu App Check está funcionando perfeitamente!** 🚀
