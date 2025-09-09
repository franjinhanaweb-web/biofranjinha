# 🔧 Variáveis de Ambiente - Cloudflare Pages

## 📋 Variáveis Obrigatórias

Configure estas variáveis no **Cloudflare Pages** → **Settings** → **Environment Variables**:

### 🔥 Firebase
```
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 🛡️ App Check (reCAPTCHA)
```
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_do_recaptcha
```

### 🐛 Debug (Opcional - apenas para desenvolvimento)
```
REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token_aqui
```

---

## 🎯 Como Configurar

### 1. **Acesse o Cloudflare Pages**
- Vá para [Cloudflare Dashboard](https://dash.cloudflare.com)
- Selecione seu projeto
- Vá para **Pages** → **Seu Projeto** → **Settings**

### 2. **Configure as Variáveis**
- Clique em **Environment Variables**
- Adicione cada variável acima
- **IMPORTANTE:** Marque como **"Production"** para todas

### 3. **Redeploy**
- Após configurar, faça um novo deploy
- As variáveis só ficam ativas após o redeploy

---

## 🔍 Onde Obter as Chaves

### **Firebase Console**
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Project Settings** (ícone de engrenagem)
4. Na aba **General**, copie as configurações do **"Your apps"**

### **reCAPTCHA (Google)**
1. Acesse [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Crie um novo site ou edite existente
3. Selecione **reCAPTCHA v3**
4. Adicione seus domínios
5. Copie a **Site Key** (não a Secret Key!)

### **Debug Token (Firebase)**
1. Firebase Console → **App Check**
2. Vá para **Debug tokens**
3. Clique em **"Add debug token"**
4. Cole o token gerado

---

## ✅ Verificação

Após configurar, verifique no console do navegador:

```javascript
// Cole no console para verificar
console.log('Firebase API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Configurado' : '❌ Não configurado');
console.log('reCAPTCHA Site Key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY ? '✅ Configurado' : '❌ Não configurado');
console.log('Debug Token:', process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN ? '✅ Configurado' : '❌ Não configurado');
```

---

## 🚨 Importante

- **NUNCA** commite as chaves no código
- **SEMPRE** use variáveis de ambiente
- **SEMPRE** faça redeploy após configurar variáveis
- **MANTENHA** as chaves secretas seguras

---

## 📞 Suporte

Se tiver problemas:
1. Verifique se todas as variáveis estão configuradas
2. Faça um redeploy completo
3. Verifique o console do navegador para erros
4. Confirme se as chaves estão corretas no Firebase Console
