# 🔐 Configuração do Firebase App Check com reCAPTCHA v3

## ❌ **Problema Atual:**
- Site key detectada: `6LdbFb4rAA...`
- Erro 400 (Bad Request) no Firebase App Check
- Throttling ativo (tentativas bloqueadas por 1 segundo)

## 🔧 **Solução Passo a Passo:**

### 1. **Verificar APIs no Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto do Firebase
3. Vá em **APIs & Services** > **Library**
4. Certifique-se de que **reCAPTCHA Enterprise API** está habilitada
5. Se não estiver, clique em **Enable**

### 2. **Configurar reCAPTCHA v3**

1. Acesse: https://www.google.com/recaptcha/admin
2. Clique em **+** para criar um novo site
3. Configure:
   - **Label**: `Franjinha App Check`
   - **reCAPTCHA type**: `reCAPTCHA v3`
   - **Domains**: 
     - `localhost` (para desenvolvimento)
     - `seu-dominio.com` (para produção)
     - `*.pages.dev` (se usando Cloudflare Pages)
4. Aceite os termos e clique em **Submit**
5. **Copie a Site Key** gerada (esta é a que vai no Cloudflare)

### 3. **Configurar no Firebase Console**

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **App Check** (no menu lateral)
4. Clique em **Get started**
5. Configure:
   - **App**: Selecione seu app web
   - **Provider**: `reCAPTCHA v3`
   - **Site key**: Cole a **Site Key** do reCAPTCHA (do passo 2)
6. Clique em **Save**

**📝 Nota**: O Firebase usa automaticamente a API Key do Google Cloud Console. Você só precisa da **Site Key** do reCAPTCHA.

### 4. **Configurar no Cloudflare**

1. Acesse: **Cloudflare Pages** > Seu projeto
2. Vá em **Settings** > **Environment Variables**
3. Adicione:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
   ```
4. Faça **redeploy** do projeto

### 5. **Verificar Configuração**

Após o redeploy, o console deve mostrar:
- ✅ Site key detectada: `sua_nova_site_key...`
- ✅ App Check inicializado com reCAPTCHA v3
- ✅ Token do App Check obtido com sucesso
- ❌ Sem erros 400

## 🔑 **Resumo das Chaves:**

| Chave | Onde Obter | Onde Usar | Finalidade |
|-------|------------|-----------|------------|
| **API Key** | Google Cloud Console | Firebase (automático) | Autenticação do backend |
| **Site Key** | reCAPTCHA Admin | Firebase Console + Cloudflare | Validação do frontend |

## 🚨 **Pontos Importantes:**

1. **Site Key deve ser específica para reCAPTCHA v3**
2. **Domínios devem incluir localhost e produção**
3. **Firebase App Check deve estar habilitado**
4. **Variável de ambiente deve ser `REACT_APP_RECAPTCHA_SITE_KEY`**
5. **API Key é usada automaticamente pelo Firebase**
6. **Site Key vai no Firebase Console E no Cloudflare**

## 🔍 **Debug:**

Se ainda houver problemas, verifique:
- Site key está correta no Firebase Console?
- Domínios estão configurados no reCAPTCHA?
- App Check está habilitado no Firebase?
- Variável de ambiente está configurada no Cloudflare?

## 📞 **Suporte:**

Se o problema persistir, verifique:
1. Logs do Firebase Console
2. Configuração do reCAPTCHA no Google Cloud
3. Configuração do App Check no Firebase
4. Variáveis de ambiente no Cloudflare
