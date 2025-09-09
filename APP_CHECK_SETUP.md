# Configuração do App Check com reCAPTCHA v3

## ✅ Implementação Concluída

O App Check foi configurado com reCAPTCHA v3 para proteger seu aplicativo contra abuso. Aqui está o que foi implementado:

### 📁 Arquivos Modificados/Criados:

1. **`src/config/firebase.ts`** - Configuração do App Check
2. **`src/components/RecaptchaProvider.tsx`** - Componente para carregar reCAPTCHA
3. **`src/hooks/useAppCheck.ts`** - Hook personalizado para usar App Check
4. **`firestore.rules`** - Regras atualizadas para exigir App Check
5. **`storage.rules`** - Regras atualizadas para exigir App Check

### 🔧 Configuração Necessária:

#### 1. Console do Firebase:
1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **App Check** no menu lateral
4. Clique em **Começar**
5. Selecione **reCAPTCHA v3** como provedor
6. Configure o reCAPTCHA v3 com sua chave: `6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras`
7. Adicione seus domínios autorizados (ex: `seu-dominio.com`, `localhost` para desenvolvimento)
8. Ative o App Check para Firestore e Storage

#### 2. Configuração no Cloudflare Pages:
Como você hospeda no Cloudflare, siga estes passos:

**No Cloudflare Dashboard:**
1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá em **Pages** → Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add variable**
5. Configure:
   - **Variable name**: `REACT_APP_RECAPTCHA_SITE_KEY`
   - **Value**: `6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras`
   - **Environment**: Production (e Preview se quiser testar)
6. Clique em **Save**

**✅ Sua chave do reCAPTCHA já está configurada no Cloudflare!**

**Para desenvolvimento local**, crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_RECAPTCHA_SITE_KEY=6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras
```

#### 3. Uso no Código:

```tsx
import RecaptchaProvider from './components/RecaptchaProvider';
import { useAppCheck } from './hooks/useAppCheck';

function App() {
  return (
    <RecaptchaProvider>
      <YourAppContent />
    </RecaptchaProvider>
  );
}

// Em qualquer componente:
function MyComponent() {
  const { isReady, getToken } = useAppCheck();
  
  const handleAction = async () => {
    if (isReady) {
      const token = await getToken();
      // Use o token para operações que requerem App Check
    }
  };
}
```

### 🚀 Deploy das Regras:

```bash
# Deploy das regras do Firestore
firebase deploy --only firestore:rules

# Deploy das regras do Storage
firebase deploy --only storage
```

### 🌐 Deploy no Cloudflare:

1. **Configure a variável de ambiente** no Cloudflare Pages (já feito)
2. **Faça o deploy do seu código:**
   ```bash
   # Se usando Git
   git add .
   git commit -m "Add App Check with reCAPTCHA v3"
   git push
   
   # O Cloudflare fará o deploy automaticamente
   ```

3. **Verifique se a variável está sendo usada:**
   - Acesse seu site em produção
   - Abra o console do navegador
   - Deve aparecer "App Check initialized" (em produção)

### ⚠️ Importante:

1. **Desenvolvimento**: O App Check só funciona em produção. Em desenvolvimento, as operações funcionarão normalmente.

2. **Domínios**: Configure os domínios autorizados no console do Firebase para que o reCAPTCHA funcione.

3. **Testes**: Use tokens de debug temporários para testar em desenvolvimento se necessário.

4. **Monitoramento**: Monitore o console do Firebase para ver estatísticas de uso do App Check.

### 🔒 Segurança:

- Todas as operações no Firestore e Storage agora requerem App Check
- Apenas usuários autenticados com email verificado podem acessar
- Bots e scripts maliciosos serão bloqueados automaticamente

### 🧪 Testando a Configuração:

1. **Para desenvolvimento local:**
   ```bash
   # Crie o arquivo .env local
   echo "REACT_APP_RECAPTCHA_SITE_KEY=6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras" > .env
   
   # Execute localmente
   npm start
   # O App Check não será ativo em desenvolvimento
   ```

2. **Para produção no Cloudflare:**
   - Adicione a variável `REACT_APP_RECAPTCHA_SITE_KEY` no Cloudflare Pages
   - Faça o deploy do seu projeto
   - O App Check será ativado automaticamente em produção

3. **Verifique no console do navegador:**
   - Em produção: Deve aparecer "App Check initialized"
   - Em desenvolvimento: Sem erros, App Check desabilitado
   - Verifique se não há erros de reCAPTCHA

4. **Teste as operações protegidas:**
   - Tente fazer operações no Firestore/Storage
   - Em produção: Deve funcionar com App Check
   - Em desenvolvimento: Deve funcionar normalmente

### 👀 Como Visualizar o App Check Funcionando:

#### **1. Componente de Status (Recomendado):**
Adicione o componente `AppCheckStatus` em qualquer página para ver o App Check em tempo real:

```tsx
import AppCheckStatus from './components/AppCheckStatus';

function App() {
  return (
    <div>
      <AppCheckStatus />
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

**O que você verá:**
- ✅ Status do App Check (Pronto/Carregando)
- 🌍 Ambiente (Desenvolvimento/Produção)
- 🔑 Botão para obter token do App Check
- 📋 Logs em tempo real
- ℹ️ Informações sobre o funcionamento

#### **2. Console do Navegador:**
Abra o DevTools (F12) e verifique:

**Em Desenvolvimento:**
```
App Check não está ativo em desenvolvimento
```

**Em Produção:**
```
App Check initialized
Token obtido com sucesso!
```

#### **3. Console do Firebase:**
1. Acesse [Console Firebase](https://console.firebase.google.com)
2. Vá em **App Check** → **Métricas**
3. Veja estatísticas de uso, tokens válidos/inválidos
4. Monitore tentativas de acesso bloqueadas

#### **4. Teste de Operações:**
- **Firestore:** Tente ler/escrever dados
- **Storage:** Tente fazer upload/download
- **Em produção:** Operações funcionam com App Check
- **Em desenvolvimento:** Operações funcionam normalmente

#### **5. Verificação de Proteção:**
- **Bots:** Serão bloqueados automaticamente
- **Scripts maliciosos:** Não conseguirão acessar sem App Check
- **Usuários legítimos:** Funcionam normalmente

### 📊 Monitoramento:

Acesse o console do Firebase > App Check para ver:
- Estatísticas de uso
- Tentativas de acesso bloqueadas
- Tokens válidos/inválidos
- Sua chave: `6LfBzsIrAAAAACxrxB_zCU6MqbsyMUcyCACAbras`
