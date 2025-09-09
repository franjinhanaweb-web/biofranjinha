import { useEffect, useState } from 'react';
import { getToken, getAppCheck } from 'firebase/app-check';

interface AppCheckState {
  isReady: boolean;
  error: string | null;
  getToken: () => Promise<string | null>;
}

export const useAppCheck = (): AppCheckState => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Em desenvolvimento, não inicializa o App Check
    if (process.env.NODE_ENV !== 'production') {
      setIsReady(true);
      return;
    }

    // Em produção, verifica se o reCAPTCHA está carregado
    const checkRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        setIsReady(true);
      } else {
        setTimeout(checkRecaptcha, 100);
      }
    };

    checkRecaptcha();
  }, []);

  const getAppCheckToken = async (): Promise<string | null> => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('App Check não está ativo em desenvolvimento');
      return null;
    }

    try {
      const { getApp } = await import('firebase/app');
      
      const app = getApp();
      const appCheck = getAppCheck(app);
      
      const token = await getToken(appCheck, false);
      return token.token;
    } catch (err) {
      console.error('Erro ao obter token do App Check:', err);
      setError('Erro ao verificar App Check');
      return null;
    }
  };

  return {
    isReady,
    error,
    getToken: getAppCheckToken
  };
};
