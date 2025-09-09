# 🔍 Diagnóstico Completo do Firebase App Check

## 📋 Checklist de Verificação

### 1. 🔥 Firebase Console - App Check

**Acesse:** [Firebase Console](https://console.firebase.google.com) → Seu Projeto → App Check

#### ✅ Verificações necessárias:

- [ ] **App Check está habilitado** no projeto
- [ ] **reCAPTCHA v3 está configurado** como provedor
- [ ] **Site Key do reCAPTCHA** está registrada
- [ ] **Domínios autorizados** incluem seu domínio de produção
- [ ] **Debug tokens** configurados para desenvolvimento (opcional)

#### 🎯 Como verificar:
1. Vá para **App Check** no menu lateral
2. Clique em **"Get started"** se não estiver configurado
3. Selecione **reCAPTCHA v3** como provedor
4. Adicione sua **Site Key** do reCAPTCHA
5. Adicione seus domínios (localhost para dev, seu domínio para produção)

---

### 2. 🔑 reCAPTCHA v3 - Google

**Acesse:** [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

#### ✅ Verificações necessárias:

- [ ] **Site registrado** com reCAPTCHA v3
- [ ] **Site Key** copiada corretamente
- [ ] **Secret Key** anotada (para backend)
- [ ] **Domínios** configurados corretamente

#### 🎯 Como verificar:
1. Acesse o painel do reCAPTCHA
2. Verifique se seu site está listado
3. Confirme que está usando **reCAPTCHA v3**
4. Copie a **Site Key** (não a Secret Key!)

---

### 3. 🌐 Variáveis de Ambiente

#### ✅ Verificações necessárias:

- [ ] `REACT_APP_FIREBASE_API_KEY` - Configurada
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN` - Configurada  
- [ ] `REACT_APP_FIREBASE_PROJECT_ID` - Configurada
- [ ] `REACT_APP_FIREBASE_APP_ID` - Configurada
- [ ] `REACT_APP_RECAPTCHA_SITE_KEY` - **CRÍTICO** - Deve estar configurada
- [ ] `REACT_APP_APP_CHECK_DEBUG_TOKEN` - Opcional para desenvolvimento

#### 🎯 Como verificar:
1. **Cloudflare Pages:** Settings → Environment Variables
2. **Local:** Arquivo `.env.local` ou `.env`
3. **Verificar se as variáveis estão sendo carregadas**

---

### 4. 🔧 Código - Configuração

#### ✅ Verificações necessárias:

- [ ] **Firebase config** carregando corretamente
- [ ] **App Check** sendo inicializado
- [ ] **reCAPTCHA** sendo carregado
- [ ] **Debug token** configurado para desenvolvimento

---

## 🚨 Problemas Comuns e Soluções

### Problema 1: "App Check detectado, mas sem método getToken"

**Causa:** App Check não foi configurado no Firebase Console

**Solução:**
1. Acesse Firebase Console → App Check
2. Configure reCAPTCHA v3
3. Adicione sua Site Key
4. Configure domínios autorizados

### Problema 2: "REACT_APP_RECAPTCHA_SITE_KEY não encontrado"

**Causa:** Variável de ambiente não configurada

**Solução:**
1. Configure a variável no Cloudflare Pages
2. Ou crie arquivo `.env.local` com:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
   ```

### Problema 3: "reCAPTCHA não carregado"

**Causa:** Site Key inválida ou domínio não autorizado

**Solução:**
1. Verifique se a Site Key está correta
2. Adicione o domínio no reCAPTCHA Admin
3. Aguarde propagação (pode levar alguns minutos)

### Problema 4: "Token de debug não funciona"

**Causa:** Debug token não configurado no Firebase Console

**Solução:**
1. Firebase Console → App Check → Debug tokens
2. Adicione o token de debug
3. Use o mesmo token no código

---

## 🧪 Teste de Diagnóstico

### 1. Verificar Console do Navegador

Abra o DevTools e procure por:

```javascript
// ✅ Sucesso - deve aparecer:
"✅ App Check inicializado com sucesso!"
"✅ Método getToken está disponível"

// ❌ Erro - se aparecer:
"⚠️ App Check não foi inicializado"
"❌ getToken não ficou disponível"
```

### 2. Verificar Variáveis de Ambiente

No console do navegador, execute:

```javascript
console.log('Site Key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY);
console.log('Debug Token:', process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN);
```

### 3. Verificar App Check na Window

```javascript
console.log('App Check:', window.appCheck);
console.log('Tem getToken?', typeof window.appCheck?.getToken);
```

---

## 📞 Próximos Passos

1. **Execute o diagnóstico** acima
2. **Anote os erros** que encontrar
3. **Configure o que estiver faltando**
4. **Teste novamente**

### 🆘 Se ainda não funcionar:

1. **Verifique se o reCAPTCHA está carregando:**
   - Abra Network tab no DevTools
   - Procure por requisições para `recaptcha`
   - Deve ter status 200

2. **Verifique se o Firebase está configurado:**
   - Console deve mostrar "Firebase initialized"
   - Sem erros de configuração

3. **Teste em modo de desenvolvimento:**
   - Use debug token
   - Configure no Firebase Console

---

## 📝 Checklist Rápido

- [ ] Firebase Console → App Check configurado
- [ ] reCAPTCHA v3 → Site Key copiada
- [ ] Cloudflare Pages → Variáveis de ambiente
- [ ] Console → Sem erros de inicialização
- [ ] Console → "getToken está disponível"

**Se todos estiverem ✅, o App Check deve funcionar!**
