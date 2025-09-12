# Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Cloudflare Pages:

## FIREBASE_WEB_API_KEY
- **Descrição**: Web API Key do projeto Firebase
- **Como obter**: Firebase Console > Project Settings > General > Web API Key
- **Exemplo**: `AIzaSyC...`

## Configuração no Cloudflare Pages
1. Acesse o dashboard do Cloudflare Pages
2. Selecione seu projeto
3. Vá em Settings > Environment Variables
4. Adicione a variável `FIREBASE_WEB_API_KEY` com o valor correspondente
5. Faça o deploy das functions
