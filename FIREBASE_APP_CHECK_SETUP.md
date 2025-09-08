# 🔐 Configuração do Firebase App Check - Passo a Passo

## ⚠️ **IMPORTANTE: Configure no Firebase Console**

### **1. Acesse o Firebase Console**
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto

### **2. Configure o App Check**
1. No menu lateral: **"Build" → "App Check"**
2. Clique em **"Get started"** ou **"Configure"**
3. Selecione seu app web

### **3. Configure o reCAPTCHA v3**
1. **Provider:** reCAPTCHA v3
2. **Site Key:** `6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z`
3. **Secret Key:** `6LfWqsIrAAAAAE_81IOXglswLlqx5m63fdqAc97H`
4. Clique em **"Save"**

### **4. Ative o App Check para os recursos**
1. **Firestore:** Ative a proteção
2. **Storage:** Ative a proteção (se usar)
3. **Functions:** Ative a proteção (se usar)

### **5. Configure para desenvolvimento (opcional)**
1. Vá em **"Debug tokens"**
2. Adicione um token de debug: `debug-token-123`
3. Use este token em desenvolvimento

## 🧪 **Teste após configuração**

1. Acesse: `https://seu-dominio.pages.dev/app-check-demo`
2. Clique em **"Testar App Check"**
3. Deve aparecer: ✅ **"App Check funcionando corretamente!"**

## 🔧 **Se ainda não funcionar**

### **Verificar no Console do Navegador (F12):**
- Deve aparecer: "✅ App Check inicializado com sucesso!"
- Se aparecer erro, verifique as credenciais

### **Verificar no Firebase Console:**
- Vá em **"App Check" → "Metrics"**
- Deve mostrar solicitações válidas

## 📋 **Checklist de Configuração**

- [ ] App Check configurado no Firebase Console
- [ ] reCAPTCHA v3 configurado com as chaves corretas
- [ ] App Check ativado para Firestore
- [ ] Regras do Firestore atualizadas
- [ ] Teste funcionando na página de demo

## 🆘 **Problemas Comuns**

### **"Missing or insufficient permissions"**
- **Causa:** App Check não configurado no Firebase Console
- **Solução:** Configure o App Check seguindo os passos acima

### **"Falha ao obter token do App Check"**
- **Causa:** reCAPTCHA não configurado corretamente
- **Solução:** Verifique as chaves do reCAPTCHA

### **"App Check não está configurado"**
- **Causa:** App Check não inicializado
- **Solução:** Verifique os logs no console do navegador
