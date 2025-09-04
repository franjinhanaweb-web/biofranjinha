# 🔧 Solução de Problemas Firebase

## ❌ **Erro 400 Bad Request no Cadastro**

### **Problema Identificado:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=... 400 (Bad Request)
```

### **🔍 Possíveis Causas:**

#### **1. Autenticação por Email/Senha Não Habilitada**
- **Mais provável:** O método de autenticação não está ativado no Firebase Console

#### **2. Configuração de Domínios Autorizados**
- Domínio do Cloudflare Pages não está na lista de domínios autorizados

#### **3. Regras do Firestore**
- Regras de segurança podem estar bloqueando a criação de usuários

## ✅ **Soluções:**

### **1. Habilitar Autenticação por Email/Senha:**

1. **Acesse:** [Firebase Console](https://console.firebase.google.com)
2. **Selecione:** Projeto `keyfirebase-68e84`
3. **Vá em:** Authentication > Sign-in method
4. **Clique em:** "Email/Password"
5. **Ative:** "Enable" para o primeiro método
6. **Salve** as alterações

### **2. Configurar Domínios Autorizados:**

1. **No Firebase Console:** Authentication > Settings
2. **Vá em:** "Authorized domains"
3. **Adicione:**
   - `biofranjinha.pages.dev` (seu domínio do Cloudflare)
   - `localhost` (para desenvolvimento local)
4. **Salve**

### **3. Verificar Regras do Firestore:**

1. **No Firebase Console:** Firestore Database > Rules
2. **Substitua por:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para usuários autenticados
    match /users_site/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
3. **Publique** as regras

### **4. Verificar Configuração do Projeto:**

1. **No Firebase Console:** Project Settings > General
2. **Verifique se:**
   - O projeto está ativo
   - As APIs estão habilitadas
   - O Firestore está configurado

## 🧪 **Teste Local:**

Para testar localmente, crie um arquivo `.env.local`:

```bash
# .env.local
REACT_APP_FIREBASE_API_KEY=AIzaSyCa9StxgMoJ3FTzGHvYJy7DiwK_KAFujAo
REACT_APP_FIREBASE_AUTH_DOMAIN=keyfirebase-68e84.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=keyfirebase-68e84
REACT_APP_FIREBASE_STORAGE_BUCKET=keyfirebase-68e84.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=56213864487
REACT_APP_FIREBASE_APP_ID=1:56213864487:web:59262a0ac202523e274e02
REACT_APP_FIREBASE_MEASUREMENT_ID=G-Y56E3DS4JC
```

## 🔄 **Após as Correções:**

1. **Teste localmente:** `npm start`
2. **Teste o cadastro** com um email novo
3. **Verifique no Firebase Console** se o usuário foi criado
4. **Faça novo deploy** no Cloudflare Pages

## 📞 **Se o Problema Persistir:**

1. **Verifique os logs** no Firebase Console > Functions > Logs
2. **Teste com Postman** ou curl para verificar a API
3. **Verifique se o projeto Firebase está ativo** e não suspenso

## ✅ **Status Esperado Após Correção:**

- ✅ Cadastro funcionando sem erro 400
- ✅ Usuário criado no Firebase Auth
- ✅ Dados salvos na coleção `users_site`
- ✅ Login funcionando corretamente
