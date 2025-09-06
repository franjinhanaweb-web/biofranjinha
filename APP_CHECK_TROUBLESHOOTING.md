# 🔧 Guia de Solução de Problemas - Firebase App Check

## 🚨 **Problema Atual: Erro 400 no App Check**

Baseado nos logs do console, você está enfrentando erros 400 ao tentar usar o Firebase App Check. Este guia vai te ajudar a resolver.

## 🔍 **Diagnóstico dos Erros**

### **Erros Identificados:**
- `AppCheck: 400 error. Attempts allowed again after 00m:01s`
- `Auth (12.2.0): Error while retrieving App Check token: FirebaseError: AppCheck: 400 error`
- `AppCheck: Requests throttled due to previous 400 error`

### **Causas Possíveis:**
1. ❌ Site key do reCAPTCHA incorreta ou não configurada
2. ❌ reCAPTCHA v3 não configurado para o domínio correto
3. ❌ App Check não habilitado no Firebase Console
4. ❌ Configuração incorreta das variáveis de ambiente

## 🛠️ **Soluções Passo a Passo**

### **1. Configurar Site Key do reCAPTCHA**

#### **A. Obter Site Key do Google reCAPTCHA:**
1. Acesse [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)
2. Crie um novo site ou use um existente
3. Selecione **reCAPTCHA v3**
4. Adicione seu domínio (ex: `seu-site.com`, `localhost` para desenvolvimento)
5. Copie a **Site Key**

#### **B. Configurar no Cloudflare Pages:**
1. Acesse **Cloudflare Pages** > Seu projeto
2. Vá em **Settings** > **Environment Variables**
3. Adicione a variável:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
   ```
4. Faça **redeploy** do projeto

#### **C. Para teste local:**
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
   ```

### **2. Habilitar App Check no Firebase Console**

#### **A. Acessar Firebase Console:**
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto

#### **B. Configurar App Check:**
1. No menu lateral, clique em **App Check**
2. Clique em **Get started** ou **Configure**
3. Selecione seu app (Web)
4. Escolha **reCAPTCHA v3** como provedor
5. Cole a **Site Key** do reCAPTCHA
6. Clique em **Save**

#### **C. Verificar Configuração:**
- O App Check deve aparecer como **Ativo**
- O status deve ser **Enforced** ou **Monitor**

### **3. Verificar Configuração do reCAPTCHA**

#### **A. Domínios Configurados:**
- Certifique-se de que o domínio está configurado no reCAPTCHA
- Para desenvolvimento: `localhost`
- Para produção: `seu-dominio.com`

#### **B. Tipo de reCAPTCHA:**
- Deve ser **reCAPTCHA v3** (não v2)
- Score mínimo: 0.5 (recomendado)

### **4. Testar Configuração**

#### **A. Verificar Logs:**
Após configurar, verifique o console do navegador:
- ✅ `App Check inicializado com reCAPTCHA v3`
- ✅ `Token do App Check obtido com sucesso`
- ❌ Se ainda houver erros 400, verifique as configurações

#### **B. Desabilitar Temporariamente (se necessário):**
Se ainda houver problemas, adicione:
```
REACT_APP_DISABLE_APP_CHECK=true
```

## 🔧 **Configuração Completa de Exemplo**

### **Variáveis de Ambiente no Cloudflare:**
```
# Firebase (obrigatório)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# reCAPTCHA (obrigatório para App Check)
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Debug (opcional)
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

## 🚀 **Próximos Passos**

1. **Configure a site key** do reCAPTCHA no Cloudflare
2. **Habilite o App Check** no Firebase Console
3. **Faça redeploy** do projeto
4. **Teste** a aplicação e verifique os logs
5. **Se ainda houver problemas**, desabilite temporariamente com `REACT_APP_DISABLE_APP_CHECK=true`

## 📞 **Suporte**

Se os problemas persistirem:
1. Verifique se todas as configurações estão corretas
2. Teste com `REACT_APP_DISABLE_APP_CHECK=true` para confirmar que o problema é do App Check
3. Verifique os logs detalhados no console do navegador

## ⚠️ **Importante**

- O App Check só funciona em **produção** por padrão
- Para testar localmente, configure `NODE_ENV=production` ou modifique o código
- Sempre faça **redeploy** após alterar variáveis de ambiente
