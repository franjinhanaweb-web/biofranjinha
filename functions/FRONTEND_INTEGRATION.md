# Integração Frontend - Firebase Session Cookie

## Visão Geral

Este documento descreve como integrar os endpoints de autenticação no frontend React para gerenciar sessões de usuário via Firebase Session Cookie.

## Endpoints Disponíveis

### POST /auth/session
- **Descrição**: Troca Firebase ID Token por Session Cookie
- **Body**: `{ "idToken": "string" }`
- **Response**: `{ "ok": boolean }`
- **Cookie**: `__session` (HttpOnly, Domain=.afranjinha.com.br)

### POST /auth/logout
- **Descrição**: Remove o Session Cookie
- **Body**: `{}`
- **Response**: `{ "ok": boolean, "message": string }`

### GET /auth/check
- **Descrição**: Verifica se existe sessão ativa
- **Response**: `{ "ok": boolean, "hasSession": boolean }`

## Implementação no React

### 1. Serviço de Autenticação

```typescript
// src/services/authService.ts
class AuthService {
  private baseUrl = '/auth'; // Ajuste conforme sua configuração

  async createSession(idToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }

  async checkSession(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      return data.ok && data.hasSession;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
```

### 2. Hook de Autenticação

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    const hasSession = await authService.checkSession();
    setIsAuthenticated(hasSession);
    setIsLoading(false);
  };

  const login = async (idToken: string) => {
    const success = await authService.createSession(idToken);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = async () => {
    const success = await authService.logout();
    if (success) {
      setIsAuthenticated(false);
    }
    return success;
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };
};
```

### 3. Integração com Firebase Auth

```typescript
// src/components/LoginButton.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const LoginButton: React.FC = () => {
  const { login, logout, isAuthenticated, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);
      
      const success = await login(idToken);
      if (success) {
        console.log('Login realizado com sucesso!');
      } else {
        console.error('Falha no login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await auth.signOut();
      console.log('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleGoogleLogin}>Login com Google</button>
      )}
    </div>
  );
};

export default LoginButton;
```

### 4. Renovação Automática de Sessão

```typescript
// src/hooks/useSessionRenewal.ts
import { useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { auth } from '../firebase/config';

export const useSessionRenewal = () => {
  const renewalInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setupRenewal = async () => {
      // Verificar se há usuário logado
      const user = auth.currentUser;
      if (!user) return;

      // Renovar a cada 19 horas (20% de 24h)
      renewalInterval.current = setInterval(async () => {
        try {
          const idToken = await user.getIdToken(true);
          await authService.createSession(idToken);
          console.log('Sessão renovada automaticamente');
        } catch (error) {
          console.error('Erro ao renovar sessão:', error);
        }
      }, 19 * 60 * 60 * 1000); // 19 horas em millisegundos
    };

    setupRenewal();

    return () => {
      if (renewalInterval.current) {
        clearInterval(renewalInterval.current);
      }
    };
  }, []);
};
```

### 5. Proteção de Rotas

```typescript
// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Acesso negado</div> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

## Configuração de CORS

Se necessário, adicione os headers CORS apropriados nos endpoints:

```typescript
// Exemplo de headers CORS para desenvolvimento
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.afranjinha.com.br',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};
```

## Testes

### Fluxo de Login
1. Usuário clica em "Login com Google"
2. Firebase Auth retorna ID Token
3. Frontend chama `/auth/session` com ID Token
4. Backend retorna cookie `__session` HttpOnly
5. Usuário pode acessar `/agenda`

### Fluxo de Logout
1. Usuário clica em "Logout"
2. Frontend chama `/auth/logout`
3. Backend limpa cookie `__session`
4. Usuário é redirecionado para home

### Verificação de Sessão
1. Frontend chama `/auth/check` ao carregar
2. Backend verifica presença do cookie
3. Frontend atualiza estado de autenticação

## Notas Importantes

- **Credentials**: Sempre use `credentials: 'include'` nas requisições
- **Domínio**: Cookie é configurado para `.afranjinha.com.br`
- **Segurança**: Cookie é HttpOnly, Secure e SameSite=Strict
- **Renovação**: Implemente renovação automática para melhor UX
- **Tratamento de Erros**: Sempre trate erros de rede e autenticação
