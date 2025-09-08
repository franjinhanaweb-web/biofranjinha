# 🔥 Como Configurar as Regras do Firestore para App Check

## 📍 **Onde adicionar as regras:**

### **1. Acesse o Firebase Console**
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto

### **2. Vá para Firestore**
- No menu lateral: **"Firestore Database"**
- Clique na aba **"Rules"**

### **3. Substitua as regras atuais por estas:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar App Check
    function isAppCheckValid() {
      return request.appCheck != null && request.appCheck.valid == true;
    }
    
    // Regras para usuários do site
    match /users_site/{userId} {
      // Apenas o próprio usuário pode ler/escrever seus dados
      // + validação do App Check para maior segurança
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true
        && isAppCheckValid();
    }
    
    // Regras para códigos de verificação
    match /users_codes/{codeId} {
      // Apenas leitura para validar códigos (com App Check)
      allow read: if request.auth != null && isAppCheckValid();
      // Escrita apenas para marcar como usado (com validação + App Check)
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.usedBy
        && request.writeFields.hasOnly(['isUsed', 'usedBy', 'usedAt'])
        && isAppCheckValid();
    }
    
    // Coleção de teste do App Check (permissiva para testes)
    match /test-appcheck/{document} {
      allow read, write: if isAppCheckValid();
    }
    
    // Bloquear todas as outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **4. Publique as regras**
- Clique em **"Publish"**
- Aguarde a confirmação

## 🧪 **Teste após configurar:**

1. Acesse: `https://seu-dominio.pages.dev/app-check-demo`
2. Clique em **"Testar App Check"**
3. Deve aparecer: **"App Check funcionando corretamente!"**

## ⚠️ **Importante:**

- **Site Key:** Será gerada automaticamente pelo Firebase
- **Secret Key:** Use a que você forneceu
- **Domain:** Adicione seu domínio do Cloudflare Pages
- **Regras:** Substitua completamente as regras atuais

## 🔍 **Verificar se funcionou:**

### **Console do navegador (F12):**
Deve aparecer:
```
✅ App Check inicializado com sucesso!
```

### **Página de testes:**
- **Acesso Normal:** ✅ Sucesso
- **Permissão de Escrita:** ✅ Sucesso
- **Rate Limiting:** ⚠️ Algumas falhas (correto!)
- **Token Inválido:** ✅ Bloqueado (correto!)

## 🆘 **Se não funcionar:**

1. **Verifique o domínio** no reCAPTCHA Enterprise
2. **Confirme que as regras foram publicadas**
3. **Aguarde alguns minutos** para propagação
4. **Teste novamente**

**As regras são essenciais para o App Check funcionar!** 🚀
