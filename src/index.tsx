import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { suppressNetworkErrors } from './utils/errorSuppression';
import { initializeBuildConfig } from './config/buildConfig';
import { initializeAppCheckService } from './services/appCheckService';

// Inicializar configurações de build e segurança
initializeBuildConfig();

// Inicializar App Check (se configurado)
initializeAppCheckService();

// Suprimir erros de rede bloqueados pelo cliente
suppressNetworkErrors();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

