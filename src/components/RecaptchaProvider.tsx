import React, { useEffect, useState } from 'react';

interface RecaptchaProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RecaptchaProvider: React.FC<RecaptchaProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        console.error('Erro ao carregar reCAPTCHA');
      };

      document.head.appendChild(script);
    };

    // Só carrega em produção
    if (process.env.NODE_ENV === 'production') {
      loadRecaptcha();
    } else {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div>
      {isLoaded ? children : (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando reCAPTCHA...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecaptchaProvider;
