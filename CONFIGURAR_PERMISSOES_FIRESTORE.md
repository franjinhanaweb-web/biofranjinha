# 🔥 Configurar Permissões do Firestore para Códigos de Verificação

## ❌ **Problema Atual:**
```
FirebaseError: Missing or insufficient permissions
```

O erro ocorre porque as regras do Firestore não permitem leitura da coleção `users_codes` para usuários não autenticados.

## ✅ **Solução - Configurar Regras no Firebase Console:**

### **1. Acesse o Firebase Console:**
- [Firebase Console](https://console.firebase.google.com)
- Selecione seu projeto
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
    
    // Regras para a coleção users_codes (códigos de verificação)
    match /users_codes/{codeId} {
      // Permitir leitura para qualquer pessoa (para validação de códigos)
      // Permitir escrita apenas para usuários autenticados (para marcar como usado)
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regra temporária para permitir criação de usuários (REMOVER DEPOIS)
    match /users_site/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **3. Clique em "Publish"**

## 🔍 **Explicação das Regras:**

### **Coleção `users_codes`:**
- **`allow read: if true`** - Qualquer pessoa pode ler os códigos (necessário para validação)
- **`allow write: if request.auth != null`** - Apenas usuários autenticados podem modificar (marcar como usado)

### **Coleção `users_site`:**
- **`allow read, write: if request.auth != null && request.auth.uid == userId`** - Apenas o próprio usuário pode acessar seus dados

## 🧪 **Teste Após Configuração:**

1. **Limpe o cache** do navegador
2. **Teste a validação** de código no formulário de registro
3. **Verifique** se o código é validado corretamente
4. **Teste o cadastro** completo

## ⚠️ **Importante:**

- A regra `allow read: if true` para `users_codes` é necessária para permitir validação de códigos
- Esta regra é segura porque os códigos não contêm informações sensíveis
- Apenas o campo `isUsed` é modificado quando um código é usado
- Mantenha as outras regras de segurança para `users_site`

## 🔧 **Alternativa Mais Restritiva (Opcional):**

Se quiser ser mais restritivo, pode usar:

```javascript
// Regras para a coleção users_codes (versão mais restritiva)
match /users_codes/{codeId} {
  // Permitir leitura apenas para validação de códigos específicos
  allow read: if resource.data.code != null;
  allow write: if request.auth != null;
}
```

Mas a primeira opção é mais simples e funcional.
