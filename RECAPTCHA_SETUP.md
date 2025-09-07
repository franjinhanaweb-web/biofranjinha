# 🔐 Configuração do reCAPTCHA para App Check

## 📋 **Opções Disponíveis**

### **1. reCAPTCHA v2 (Recomendado para começar)**
- Mais simples de configurar
- Interface visual ("I'm not a robot")
- Funciona bem com App Check

### **2. reCAPTCHA Enterprise**
- Mais recursos avançados
- Melhor para aplicações empresariais
- Requer configuração adicional

## 🚀 **Como Configurar reCAPTCHA v2**

### **Passo 1: Criar no Google reCAPTCHA**

1. Acesse: https://www.google.com/recaptcha/admin
2. Faça login com sua conta Google
3. Clique em **"+"** para criar novo site
4. Preencha:
   - **Label:** "InfoPDF App" (ou nome do seu projeto)
   - **reCAPTCHA type:** Selecione **"reCAPTCHA v2"**
   - **Subtype:** Selecione **"I'm not a robot" Checkbox**
   - **Domains:** Adicione:
     - `localhost` (para desenvolvimento)
     - `seu-dominio.com` (para produção)
     - `*.seu-dominio.com` (para subdomínios)
5. Aceite os termos de uso
6. Clique em **"Submit"**

### **Passo 2: Copiar as Chaves**

Após criar, você verá:
- **Site Key** (pública) - use no frontend
- **Secret Key** (privada) - use no backend

**Copie a Site Key** - você precisará dela!

### **Passo 3: Configurar no Firebase Console**

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **App Check** no menu lateral
4. Clique em **"Get started"**
5. Selecione **"reCAPTCHA v2"**
6. Cole a **Site Key** que você copiou
7. Clique em **"Save"**

### **Passo 4: Configurar Variáveis de Ambiente**

No Cloudflare Pages, adicione:

```bash
# reCAPTCHA v2
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
REACT_APP_RECAPTCHA_TYPE=v2

# App Check Debug Token (opcional para desenvolvimento)
REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token_aqui
```

## 🚀 **Como Configurar reCAPTCHA Enterprise**

### **Passo 1: Criar no Google reCAPTCHA**

1. Acesse: https://www.google.com/recaptcha/admin
2. Clique em **"+"** para criar novo site
3. Preencha:
   - **Label:** "InfoPDF App Enterprise"
   - **reCAPTCHA type:** Selecione **"reCAPTCHA Enterprise"**
   - **Domains:** Adicione seus domínios
4. Clique em **"Submit"**

### **Passo 2: Configurar no Firebase Console**

1. No Firebase Console > **App Check**
2. Selecione **"reCAPTCHA Enterprise"**
3. Cole a **Site Key** do Enterprise
4. Configure o **Project Number** (encontrado em Project Settings)

### **Passo 3: Configurar Variáveis de Ambiente**

```bash
# reCAPTCHA Enterprise
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_enterprise_aqui
REACT_APP_RECAPTCHA_TYPE=enterprise

# App Check Debug Token
REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token_aqui
```

## 🧪 **Testando a Configuração**

### **1. Teste Local**

```bash
# Criar arquivo .env.local
echo "REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key" > .env.local
echo "REACT_APP_RECAPTCHA_TYPE=v2" >> .env.local
echo "REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token" >> .env.local

# Executar aplicação
npm start
```

### **2. Verificar no Console**

Procure por estas mensagens:
- ✅ `App Check inicializado com sucesso`
- ❌ `App Check não foi inicializado - configuração inválida`

### **3. Usar Componente de Teste**

Adicione em qualquer página:

```tsx
import AppCheckTest from './components/AppCheckTest';

// Em sua página
<AppCheckTest />
```

## 🔧 **Troubleshooting**

### **Erro: "reCAPTCHA não carregado"**

**Causa:** Domínio não registrado
**Solução:** Adicione `localhost` e seu domínio nas configurações do reCAPTCHA

### **Erro: "Site Key inválida"**

**Causa:** Site Key incorreta ou expirada
**Solução:** Verifique se copiou a Site Key correta do Google reCAPTCHA

### **Erro: "App Check não inicializa"**

**Causa:** Configuração incorreta no Firebase
**Solução:** Verifique se configurou corretamente no Firebase Console

## 📊 **Diferenças entre v2 e Enterprise**

| Recurso | reCAPTCHA v2 | reCAPTCHA Enterprise |
|---------|--------------|---------------------|
| **Configuração** | Simples | Mais complexa |
| **Interface** | Checkbox visual | Invisível |
| **Custo** | Gratuito | Pago |
| **Recursos** | Básicos | Avançados |
| **App Check** | ✅ Suportado | ✅ Suportado |

## 🎯 **Recomendação**

Para começar, use **reCAPTCHA v2**:
- Mais simples de configurar
- Funciona perfeitamente com App Check
- Gratuito
- Interface visual clara

Depois, se precisar de recursos avançados, migre para Enterprise.

## 📚 **Links Úteis**

- [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- [Firebase App Check Console](https://console.firebase.google.com)
- [Documentação reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display)
- [Documentação reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs)

