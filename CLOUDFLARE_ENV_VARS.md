# 🔧 Variáveis de Ambiente para Cloudflare Pages

## 📋 **Variáveis Obrigatórias**

### Firebase (já configuradas)
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### reCAPTCHA (configurar com padrão REACT_APP_)
```
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## 🔧 **Variáveis Opcionais de Desenvolvimento**

### Para habilitar DevTools em produção (NÃO RECOMENDADO)
```
REACT_APP_ENABLE_DEVTOOLS=true
```

### Para desabilitar proteção do código fonte
```
REACT_APP_DISABLE_SOURCE_PROTECTION=true
```

### Para remover console.log em produção
```
REACT_APP_REMOVE_CONSOLE=true
```

### Para habilitar proteção do código fonte
```
REACT_APP_ENABLE_SOURCE_PROTECTION=true
```

### Para habilitar debug
```
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```


## 🎯 **Configuração Recomendada para Produção**

### Mínima (DevTools habilitados)
```
# Firebase (obrigatório)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...

# reCAPTCHA (obrigatório)
REACT_APP_RECAPTCHA_SITE_KEY=...

# Desabilitar proteções (opcional)
REACT_APP_DISABLE_SOURCE_PROTECTION=true
```

### Máxima Segurança (DevTools bloqueados)
```
# Firebase (obrigatório)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...

# reCAPTCHA (obrigatório)
REACT_APP_RECAPTCHA_SITE_KEY=...

# Segurança máxima
REACT_APP_ENABLE_SOURCE_PROTECTION=true
REACT_APP_REMOVE_CONSOLE=true
```

## 🚀 **Como Configurar no Cloudflare**

1. Acesse **Cloudflare Pages** > Seu projeto
2. Vá em **Settings** > **Environment Variables**
3. Adicione as variáveis necessárias
4. Faça **redeploy** do projeto

### 📋 **Configuração de Build no Cloudflare**

- **Build command**: `npm run build`
- **Build output directory**: `build`
- **Node.js version**: `18` ou superior

## 🔍 **Como Testar**

1. **Desenvolvimento local**: `npm start` - DevTools sempre habilitados
2. **Produção com DevTools**: Adicione `REACT_APP_DISABLE_SOURCE_PROTECTION=true`
3. **Produção segura**: Adicione `REACT_APP_ENABLE_SOURCE_PROTECTION=true`

## ⚠️ **Importante**

- **Por padrão**: DevTools habilitados em produção
- **Para segurança**: Adicione `REACT_APP_ENABLE_SOURCE_PROTECTION=true`
- **Para debug**: Adicione `REACT_APP_DEBUG=true`
