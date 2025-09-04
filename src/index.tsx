import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { suppressNetworkErrors } from './utils/errorSuppression';

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

