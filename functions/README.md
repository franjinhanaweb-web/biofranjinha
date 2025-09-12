# Firebase Session Cookie Integration

Sistema de autenticação baseado em Firebase Session Cookies para o domínio `*.afranjinha.com.br`.

## Arquitetura

- **Frontend**: React + TypeScript hospedado no Cloudflare Pages
- **Backend**: Cloudflare Pages Functions (TypeScript)
- **Autenticação**: Firebase Auth + Session Cookies
- **Domínio**: `.afranjinha.com.br` (wildcard para subdomínios)

## Funcionalidades

### ✅ Endpoints Implementados

1. **POST /auth/session**
   - Troca Firebase ID Token por Session Cookie
   - Cookie: `__session` (HttpOnly, Secure, SameSite=Strict)
   - TTL: 24 horas

2. **POST /auth/logout**
   - Remove Session Cookie
   - Limpa cookie com Max-Age=0

3. **GET /auth/check**
   - Verifica existência de sessão
   - Retorna status sem validação criptográfica

### ✅ Configuração de Segurança

- Cookie HttpOnly (não acessível via JavaScript)
- Cookie Secure (apenas HTTPS)
- Cookie SameSite=Strict (proteção CSRF)
- Domínio amplo `.afranjinha.com.br`
- Headers de segurança (X-Content-Type-Options, etc.)

## Estrutura do Projeto

```
functions/
├── src/
│   ├── auth/
│   │   ├── session.ts      # POST /auth/session
│   │   ├── logout.ts       # POST /auth/logout
│   │   └── check.ts        # GET /auth/check
│   ├── types.ts            # Interfaces TypeScript
│   └── index.ts            # Roteador principal
├── dist/                   # Código compilado
├── package.json
├── tsconfig.json
├── wrangler.toml
├── ENVIRONMENT.md          # Configuração de variáveis
├── FRONTEND_INTEGRATION.md # Guia de integração
└── README.md
```

## Configuração

### 1. Variáveis de Ambiente

Configure no Cloudflare Pages Dashboard:

```bash
FIREBASE_WEB_API_KEY=AIzaSyC...  # Web API Key do Firebase
```

### 2. Deploy

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Deploy para Cloudflare Pages
npm run deploy
```

## Uso

### Frontend (React)

```typescript
// Login
const idToken = await user.getIdToken(true);
const response = await fetch('/auth/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ idToken }),
});

// Logout
await fetch('/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

// Verificar sessão
const response = await fetch('/auth/check', {
  credentials: 'include',
});
const { hasSession } = await response.json();
```

### Integração com Worker da Agenda

O Worker existente em `www.afranjinha.com.br/agenda/*` deve validar o cookie `__session` e redirecionar para `/` se inválido.

## Fluxo de Autenticação

1. **Login**: Usuário faz login no Firebase Auth
2. **Troca**: Frontend troca ID Token por Session Cookie
3. **Acesso**: Usuário acessa `/agenda` com cookie válido
4. **Validação**: Worker valida cookie e libera acesso
5. **Renovação**: Cookie é renovado automaticamente
6. **Logout**: Cookie é removido do domínio amplo

## Políticas do Cookie

- **Nome**: `__session`
- **Domínio**: `.afranjinha.com.br`
- **Path**: `/`
- **HttpOnly**: ✅ (não acessível via JS)
- **Secure**: ✅ (apenas HTTPS)
- **SameSite**: `Strict`
- **Max-Age**: `86400` (24 horas)

## Testes

### Cenários de Teste

1. **Fluxo Feliz**
   - Login → Sessão criada → Acesso à agenda

2. **Usuário Anônimo**
   - Acesso direto à agenda → Redirecionamento para home

3. **Logout**
   - Logout → Cookie removido → Acesso negado

4. **Renovação**
   - Sessão próxima do vencimento → Renovação automática

### Verificações

- [ ] Cookie `__session` é criado com domínio correto
- [ ] Cookie tem flags de segurança apropriadas
- [ ] Worker da agenda valida cookie corretamente
- [ ] Redirecionamento funciona para usuários não autenticados
- [ ] Logout remove cookie do domínio amplo

## Troubleshooting

### Problemas Comuns

1. **Cookie não é criado**
   - Verificar se `credentials: 'include'` está sendo usado
   - Verificar se o domínio está correto

2. **Cookie não persiste**
   - Verificar configuração de HTTPS
   - Verificar flags de segurança

3. **Worker não valida cookie**
   - Verificar se o Worker está lendo o header `Cookie`
   - Verificar se o nome do cookie está correto

### Logs

Os endpoints logam erros sem expor tokens sensíveis:

```typescript
console.error('Firebase Auth error:', status, statusText);
console.error('Session creation error:', error);
```

## Desenvolvimento

### Comandos Disponíveis

```bash
npm run build    # Compilar TypeScript
npm run dev      # Modo watch
npm run lint     # Verificar código
npm run deploy   # Deploy para Cloudflare
```

### Estrutura de Desenvolvimento

- Código fonte em `src/`
- Código compilado em `dist/`
- Configuração em `wrangler.toml`
- Documentação em arquivos `.md`

## Segurança

- ✅ Não loga tokens em texto puro
- ✅ Headers de segurança configurados
- ✅ Validação de entrada nos endpoints
- ✅ Tratamento de erros genérico
- ✅ Cookie HttpOnly e Secure

## Próximos Passos

1. Configurar variáveis de ambiente no Cloudflare
2. Fazer deploy das functions
3. Integrar no frontend React
4. Testar fluxo completo
5. Configurar renovação automática
6. Monitorar logs e performance
