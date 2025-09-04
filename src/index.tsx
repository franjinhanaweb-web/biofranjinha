import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { suppressNetworkErrors } from './utils/errorSuppression';
import { initializeBuildConfig } from './config/buildConfig';
import { initializeAppCheckService } from './services/appCheckService';
import { logEnvironmentConfig, validateEnvironment } from './config/environment';
import { enableDevTools, toggleSourceProtectionByEnvironment } from './utils/devTools';

// Validar configuração de ambiente (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const envValidation = validateEnvironment();
  if (!envValidation.isValid) {
    console.warn('⚠️ Configuração de ambiente incompleta:', envValidation.missing);
  }
}

// Log de configuração (apenas em desenvolvimento)
logEnvironmentConfig();

// Habilitar DevTools em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  enableDevTools();
}

// Inicializar configurações de build e segurança
initializeBuildConfig();

// Inicializar App Check (se configurado)
initializeAppCheckService();

// Suprimir erros de rede bloqueados pelo cliente
suppressNetworkErrors();

// Controlar proteção do código fonte baseada no ambiente
toggleSourceProtectionByEnvironment();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

