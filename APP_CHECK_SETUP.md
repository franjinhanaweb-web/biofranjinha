# 🔐 Firebase App Check - Guia de Configuração

## 📋 **Visão Geral**

O Firebase App Check é uma camada de segurança que protege seus recursos do Firebase contra abuso e ataques automatizados. Ele verifica se as requisições vêm de seu aplicativo legítimo.

## 🚀 **O que foi implementado**

### ✅ **Arquivos Criados/Modificados:**

1. **`src/config/firebase.ts`** - Configuração principal do App Check
2. **`src/services/appCheckService.ts`** - Serviço para gerenciar tokens
3. **`src/config/appCheckConfig.ts`** - Configurações específicas do App Check
4. **`src/components/AppCheckTest.tsx`** - Componente para testar a implementação
5. **`src/services/authService.ts`** - Integração com autenticação
6. **`firestore.rules`** - Regras de segurança atualizadas
7. **`CLOUDFLARE_ENV_VARS.md`** - Variáveis de ambiente atualizadas

## 🔧 **Configuração Necessária**

### **1. Firebase Console - App Check**

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **App Check** no menu lateral
4. Clique em **Get started**

### **2. Configurar reCAPTCHA v3**

1. No Firebase Console > **App Check**
2. Clique em **reCAPTCHA v3**
3. Adicione seu domínio (ex: `seu-site.com`)
4. Copie a **Site Key** gerada

### **3. Configurar no Cloudflare Pages**

Adicione estas variáveis de ambiente:

```bash
# reCAPTCHA v3 (obrigatório)
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui

# App Check Debug Token (opcional para desenvolvimento)
REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token_aqui
```

### **4. Obter Debug Token (Desenvolvimento)**

Para testar localmente:

1. No Firebase Console > **App Check**
2. Clique em **Debug tokens**
3. Clique em **Add debug token**
4. Digite um nome (ex: "Local Development")
5. Copie o token gerado

## 🧪 **Como Testar**

### **1. Teste Local**

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env.local com:
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key
REACT_APP_APP_CHECK_DEBUG_TOKEN=seu_debug_token

# Executar aplicação
npm start
```

### **2. Usar Componente de Teste**

Adicione o componente `AppCheckTest` em qualquer página:

```tsx
import AppCheckTest from './components/AppCheckTest';

// Em sua página
<AppCheckTest />
```

### **3. Verificar Console**

Procure por estas mensagens no console:

- ✅ `App Check inicializado com sucesso`
- ❌ `App Check não foi inicializado - configuração inválida`

## 🔒 **Segurança Implementada**

### **1. Proteção do Firestore**

- Todas as operações de leitura/escrita agora requerem App Check válido
- Tokens são validados automaticamente pelo Firebase
- Proteção contra ataques automatizados

### **2. Integração com Autenticação**

- Tokens do App Check são obtidos durante login/cadastro
- Armazenados junto com dados do usuário
- Renovação automática de tokens

### **3. Validação de Ambiente**

- Configurações diferentes para desenvolvimento/produção
- Debug tokens apenas em desenvolvimento
- Validação automática de configurações

## 🚨 **Troubleshooting**

### **Erro: "App Check não foi inicializado"**

**Causa:** reCAPTCHA Site Key não configurado
**Solução:** Verifique se `REACT_APP_RECAPTCHA_SITE_KEY` está definido

### **Erro: "Token inválido"**

**Causa:** Debug token incorreto ou expirado
**Solução:** Gere um novo debug token no Firebase Console

### **Erro: "reCAPTCHA não carregado"**

**Causa:** Site não registrado no reCAPTCHA
**Solução:** Adicione seu domínio nas configurações do reCAPTCHA

### **Erro: "App Check token expirado"**

**Causa:** Token expirou (válido por 1 hora)
**Solução:** O token é renovado automaticamente, mas você pode forçar:

```typescript
const token = await appCheckService.getTokenWithRefresh();
```

## 📊 **Monitoramento**

### **Firebase Console**

1. Acesse **App Check** > **Metrics**
2. Monitore:
   - Tokens gerados
   - Requisições bloqueadas
   - Erros de validação

### **Logs do Aplicativo**

```typescript
// Verificar status
console.log('App Check disponível:', appCheckService.isAvailable());

// Testar token
const token = await appCheckService.getToken();
console.log('Token obtido:', !!token);
```

## 🔄 **Próximos Passos**

1. **Configurar reCAPTCHA v3** no Firebase Console
2. **Adicionar variáveis** no Cloudflare Pages
3. **Testar localmente** com debug token
4. **Fazer deploy** e testar em produção
5. **Monitorar métricas** no Firebase Console

## 📚 **Recursos Adicionais**

- [Documentação oficial do App Check](https://firebase.google.com/docs/app-check)
- [Guia de reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [Regras de segurança do Firestore](https://firebase.google.com/docs/firestore/security/get-started)

## ⚠️ **Importante**

- **Nunca** exponha debug tokens em produção
- **Sempre** valide tokens no backend
- **Monitore** regularmente as métricas de segurança
- **Teste** em diferentes ambientes antes do deploy

