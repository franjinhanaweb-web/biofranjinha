# 🔥 Regras do Firestore - Coleção users_site

## ❌ **Problema Atual:**
```
FirebaseError: Missing or insufficient permissions
```

## ✅ **Solução - Configurar Regras:**

### **1. Acesse o Firebase Console:**
- [Firebase Console](https://console.firebase.google.com)
- Projeto: `keyfirebase-68e84`
- Vá em **Firestore Database > Rules**

### **2. Substitua as Regras Atuais por:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção users_site
    match /users_site/{userId} {
      // Permitir leitura e escrita apenas para o próprio usuário autenticado
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regra temporária para permitir criação de usuários (REMOVER DEPOIS)
    match /users_site/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **3. Clique em "Publish"**

## 🔧 **Configuração Adicional:**

### **1. Verificar Autenticação:**
- **Authentication > Sign-in method**
- Certifique-se que **Email/Password** está ativado

### **2. Verificar Domínios Autorizados:**
- **Authentication > Settings > Authorized domains**
- Adicione: `biofranjinha.pages.dev`
- Adicione: `localhost` (para desenvolvimento)

### **3. Verificar APIs Habilitadas:**
- **Google Cloud Console > APIs & Services**
- Certifique-se que estas APIs estão ativas:
  - Cloud Firestore API
  - Firebase Authentication API

## 🧪 **Teste Após Configuração:**

1. **Limpe o cache** do navegador
2. **Teste o cadastro** novamente
3. **Verifique** se o usuário aparece no Firebase Console

## ⚠️ **Importante:**
- As regras temporárias permitem qualquer usuário autenticado
- **REMOVA** a regra temporária após confirmar que funciona
- Mantenha apenas a regra específica por usuário
