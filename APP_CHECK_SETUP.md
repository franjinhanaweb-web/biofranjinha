# 🔐 Configuração do Firebase App Check

## 📋 Pré-requisitos

1. **reCAPTCHA Site Key** configurada no Cloudflare
2. **App Check ativado** no Firebase Console
3. **Domínio registrado** no reCAPTCHA

## 🛠️ Configuração

### 1. Firebase Console
- Acesse o Firebase Console
- Vá em "App Check" no menu lateral
- Ative o App Check para seu projeto
- Configure o reCAPTCHA v3 como provedor

### 2. reCAPTCHA Console
- Acesse https://www.google.com/recaptcha/admin
- Crie um novo site ou edite o existente
- Tipo: reCAPTCHA v3
- Domínios: seu domínio de produção
- Copie a Site Key

### 3. Variáveis de Ambiente
Adicione no Cloudflare:
```
REACT_APP_RECAPTCHA_SITE_KEY=sua_site_key_aqui
```

## 🔧 Como Funciona

### Desenvolvimento
- Usa token de debug automático
- Não precisa de configuração adicional

### Produção
- Usa reCAPTCHA v3 para verificação
- Token é renovado automaticamente
- Bloqueia requisições não verificadas

## 📊 Monitoramento

O Firebase Console mostra:
- **Solicitações verificadas**: Requisições com App Check válido
- **Cliente desatualizado**: Requisições sem App Check
- **Origem desconhecida**: Requisições de fontes não autorizadas
- **Inválidas**: Requisições com token inválido

## ⚠️ Importante

- **Leitura pública** ainda funciona (validação de códigos)
- **Escrita** requer App Check + autenticação
- **Desenvolvimento** usa token de debug
- **Produção** usa reCAPTCHA v3

## 🚀 Deploy

1. Configure as variáveis no Cloudflare
2. Faça deploy das regras atualizadas
3. Teste em produção
4. Monitore as métricas no Firebase Console
