import React from 'react';
import AppCheckStatus from './AppCheckStatus';
import AppCheckDebug from './AppCheckDebug';
import AppCheckProtectionTest from './AppCheckProtectionTest';
import RecaptchaProvider from './RecaptchaProvider';

// Exemplo de como usar o App Check na sua aplicação
const AppCheckExample: React.FC = () => {
  return (
    <RecaptchaProvider>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h2>🔒 Demonstração do App Check</h2>
            <p className="text-muted">
              Este componente mostra o status do App Check em tempo real.
              Adicione-o em qualquer página para monitorar o funcionamento.
            </p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <AppCheckStatus />
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <AppCheckDebug />
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <AppCheckProtectionTest />
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>📝 Como Usar em Sua Aplicação</h5>
              </div>
              <div className="card-body">
                <h6>1. Importe o componente:</h6>
                <pre className="bg-light p-3 rounded">
{`import AppCheckStatus from './components/AppCheckStatus';`}
                </pre>
                
                <h6>2. Adicione na sua página:</h6>
                <pre className="bg-light p-3 rounded">
{`function MinhaPagina() {
  return (
    <div>
      <AppCheckStatus />
      {/* Seu conteúdo aqui */}
    </div>
  );
}`}
                </pre>
                
                <h6>3. Use o hook em componentes:</h6>
                <pre className="bg-light p-3 rounded">
{`import { useAppCheck } from './hooks/useAppCheck';

function MeuComponente() {
  const { isReady, getToken } = useAppCheck();
  
  const handleAction = async () => {
    if (isReady) {
      const token = await getToken();
      // Use o token para operações protegidas
    }
  };
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RecaptchaProvider>
  );
};

export default AppCheckExample;
