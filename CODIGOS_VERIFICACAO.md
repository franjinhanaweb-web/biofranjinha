# 🔐 Sistema de Códigos de Verificação

Este documento explica como gerenciar os códigos de verificação para o sistema de cadastro.

## 📋 Formato dos Códigos

Os códigos são gerados no formato **UUID v4**:
```
61749772-f947-4cd8-859e-d9b6d48ea812
```

## 🚀 Como Criar 50 Códigos

### Opção 1: Script Automático (Recomendado)

1. **Execute o script via terminal:**
   ```bash
   cd my-app
   npx ts-node src/scripts/populateCodes.ts
   ```

2. **Ou execute diretamente no código:**
   ```typescript
   import { populateVerificationCodes } from './src/utils/populateVerificationCodes';
   
   // Criar 50 códigos
   await populateVerificationCodes(50);
   ```

### Opção 2: Interface Web (Futuro)

1. Adicione o componente `CodeManager` em uma página admin
2. Use os botões para criar e gerenciar códigos

### Opção 3: Firebase Console (Manual)

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Vá para **Firestore Database**
3. Crie a coleção `users_codes`
4. Adicione documentos com a seguinte estrutura:

```json
{
  "code": "61749772-f947-4cd8-859e-d9b6d48ea812",
  "isUsed": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 📊 Estrutura da Coleção `users_codes`

```typescript
interface VerificationCode {
  id: string;                    // ID automático do Firestore
  code: string;                  // UUID do código (ex: 61749772-f947-4cd8-859e-d9b6d48ea812)
  isUsed: boolean;              // Se o código foi usado
  usedBy?: string;              // UID do usuário que usou o código
  usedAt?: Timestamp;           // Data/hora que o código foi usado
  createdAt: Timestamp;         // Data/hora de criação do código
}
```

## 🔧 Funções Disponíveis

### `populateVerificationCodes(quantity: number)`
Cria a quantidade especificada de códigos únicos.

```typescript
// Criar 50 códigos
await populateVerificationCodes(50);

// Criar 100 códigos
await populateVerificationCodes(100);
```

### `listVerificationCodes()`
Lista todos os códigos existentes na coleção.

```typescript
await listVerificationCodes();
```

### `clearAllVerificationCodes()`
⚠️ **CUIDADO**: Remove todos os códigos da coleção.

```typescript
await clearAllVerificationCodes();
```

## 🧪 Como Testar

1. **Crie os códigos** usando uma das opções acima
2. **Acesse a página de cadastro**
3. **Digite um dos códigos criados**
4. **Verifique se aparece a mensagem "Código válido e pronto para uso"**
5. **Complete o cadastro**
6. **Verifique no Firebase Console** se o código foi marcado como usado

## 📝 Exemplo de Uso Completo

```typescript
import { populateVerificationCodes, listVerificationCodes } from './src/utils/populateVerificationCodes';

async function setupVerificationCodes() {
  try {
    // Criar 50 códigos
    console.log('Criando códigos...');
    await populateVerificationCodes(50);
    
    // Listar códigos criados
    console.log('Listando códigos...');
    await listVerificationCodes();
    
    console.log('✅ Setup concluído!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar
setupVerificationCodes();
```

## 🔍 Verificação no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Firestore Database**
4. Navegue para a coleção `users_codes`
5. Verifique se os códigos foram criados corretamente

## ⚠️ Importante

- **Códigos únicos**: Cada código é gerado de forma única
- **Uso único**: Cada código pode ser usado apenas uma vez
- **Associação**: Após o uso, o código fica associado ao usuário
- **Backup**: Considere fazer backup dos códigos antes de limpar a coleção

## 🆘 Solução de Problemas

### Erro: "Código não encontrado"
- Verifique se a coleção `users_codes` existe
- Confirme se o código foi criado corretamente
- Verifique a conexão com o Firebase

### Erro: "Código já foi utilizado"
- O código já foi usado por outro usuário
- Use um código diferente ou crie novos códigos

### Erro de conexão
- Verifique as configurações do Firebase
- Confirme se as regras do Firestore permitem escrita
- Verifique se o usuário está autenticado (se necessário)
