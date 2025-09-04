# 🛡️ Configuração de Segurança Firebase

## ⚠️ AÇÕES CRÍTICAS NECESSÁRIAS

### 1. **Firebase Console - Configurações Obrigatórias**

#### Authentication
- [ ] **Habilitar verificação de email** (Authentication > Sign-in method > Email/Password)
- [ ] **Configurar domínios autorizados** (Authentication > Settings > Authorized domains)
- [ ] **Habilitar MFA** (Authentication > Sign-in method > Multi-factor authentication)
- [ ] **Configurar políticas de senha** (Authentication > Settings > Password policy)

#### App Check
- [ ] **Configurar reCAPTCHA v3** (App Check > Apps > [seu-app] > reCAPTCHA v3)
- [ ] **Marcar como ENFORCE** para Firestore, Storage e Functions
- [ ] **Adicionar site key** nas variáveis de ambiente

#### Firestore
- [ ] **Deploy das regras** (`firebase deploy --only firestore:rules`)
- [ ] **Desabilitar modo teste**
- [ ] **Configurar índices** (`firebase deploy --only firestore:indexes`)

#### Storage
- [ ] **Deploy das regras** (`firebase deploy --only storage`)
- [ ] **Configurar CORS** se necessário

### 2. **Variáveis de Ambiente**

Adicionar no Cloudflare Pages ou hosting:

```env
# Firebase (já configurado)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Check (NOVO - configurar no Firebase Console)
REACT_APP_FIREBASE_APP_CHECK_SITE_KEY=your_recaptcha_site_key

# Segurança (NOVO)
REACT_APP_ENABLE_MFA=true
REACT_APP_REQUIRE_EMAIL_VERIFICATION=true
REACT_APP_MAX_LOGIN_ATTEMPTS=5
REACT_APP_LOCKOUT_DURATION=30
REACT_APP_DEBUG=false
```

### 3. **Deploy das Configurações**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto (se não feito)
firebase init

# Deploy das regras e configurações
firebase deploy --only firestore:rules,storage,hosting
```

## 🔧 **MELHORIAS IMPLEMENTADAS**

### ✅ **Autenticação Segura**
- Validação de política de senha (8+ chars, maiúscula, minúscula, números, especiais)
- Bloqueio de domínios não autorizados
- Suporte a MFA (Multi-Factor Authentication)
- Verificação obrigatória de email
- Rate limiting (5 tentativas, 30min bloqueio)
- Reautenticação para operações sensíveis

### ✅ **App Check**
- Integração com reCAPTCHA v3
- Proteção contra bots e abuso
- Validação de origem das requisições

### ✅ **Regras de Segurança**
- Firestore: Apenas usuários autenticados e verificados
- Storage: Controle de acesso por usuário
- Validação de auth.uid em todas as operações

### ✅ **Build Seguro**
- Source maps desabilitados em produção
- Console.log removidos automaticamente
- Debugger removido em produção
- Headers de segurança configurados

### ✅ **Monitoramento**
- Logs de tentativas de login falhadas
- Bloqueio automático de contas
- Timestamps de segurança

## 🚨 **PRÓXIMOS PASSOS OBRIGATÓRIOS**

1. **Configurar reCAPTCHA v3** no Google Cloud Console
2. **Adicionar site key** nas variáveis de ambiente
3. **Deploy das regras** do Firestore e Storage
4. **Testar fluxo completo** de autenticação
5. **Configurar monitoramento** de abuso

## 📋 **CHECKLIST DE SEGURANÇA**

- [ ] Verificação de email obrigatória
- [ ] Políticas de senha configuradas
- [ ] Domínios autorizados limitados
- [ ] MFA habilitado
- [ ] App Check configurado e ENFORCE
- [ ] Regras do Firestore deployadas
- [ ] Regras do Storage deployadas
- [ ] Source maps desabilitados
- [ ] Console.log removidos
- [ ] Headers de segurança configurados
- [ ] Rate limiting ativo
- [ ] Monitoramento configurado

## 🔍 **TESTES DE SEGURANÇA**

1. **Testar login com email não verificado** → Deve falhar
2. **Testar senha fraca** → Deve rejeitar
3. **Testar domínio não autorizado** → Deve rejeitar
4. **Testar múltiplas tentativas** → Deve bloquear
5. **Testar acesso direto ao Firestore** → Deve falhar sem auth
6. **Testar App Check** → Deve validar reCAPTCHA

## 📞 **SUPORTE**

Em caso de problemas:
1. Verificar logs do Firebase Console
2. Verificar variáveis de ambiente
3. Testar em modo desenvolvimento primeiro
4. Verificar configurações do reCAPTCHA
