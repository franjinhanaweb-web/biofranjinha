import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { logEnvironmentConfig, validateEnvironment } from './config/environment';

// Validar configuração de ambiente (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const envValidation = validateEnvironment();
  if (!envValidation.isValid) {
    console.warn('⚠️ Configuração de ambiente incompleta:', envValidation.missing);
  }
}

// Log de configuração (apenas em desenvolvimento)
logEnvironmentConfig();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

