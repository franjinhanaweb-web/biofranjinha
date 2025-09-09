import React, { useState, useEffect } from 'react';
import { useAppCheck } from '../hooks/useAppCheck';

const AppCheckDebug: React.FC = () => {
  const { isReady, error, getToken } = useAppCheck();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    // Coletar informações de debug
    const info = {
      environment: process.env.NODE_ENV,
      recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
      isReady,
      error,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    addLog(`Debug Info coletada: ${JSON.stringify(info, null, 2)}`);
  }, [isReady, error]);

  const handleGetToken = async () => {
    addLog('=== INICIANDO TESTE DE TOKEN ===');
    addLog(`Ambiente: ${process.env.NODE_ENV}`);
    addLog(`reCAPTCHA Site Key: ${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`);
    addLog(`App Check Ready: ${isReady}`);
    
    try {
      const token = await getToken();
      addLog(`Token obtido: ${token ? 'SIM' : 'NÃO'}`);
      
      if (token) {
        addLog(`Token (primeiros 50 chars): ${token.substring(0, 50)}...`);
        addLog(`Token completo: ${token}`);
        
        // Decodificar JWT (apenas para visualização)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          addLog(`Token payload: ${JSON.stringify(payload, null, 2)}`);
        } catch (e) {
          addLog(`Erro ao decodificar token: ${e}`);
        }
      } else {
        addLog('Token é null - App Check pode estar desabilitado');
      }
    } catch (err) {
      addLog(`ERRO ao obter token: ${err}`);
    }
    
    addLog('=== FIM DO TESTE ===');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🐛 Debug do App Check</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <h6>📊 Informações do Sistema:</h6>
            <pre className="bg-light p-3 rounded small">
{JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          <div className="col-md-6">
            <h6>🎮 Controles:</h6>
            <button 
              className="btn btn-primary me-2 mb-2" 
              onClick={handleGetToken}
              disabled={!isReady}
            >
              🔑 Testar Token
            </button>
            <button 
              className="btn btn-outline-secondary mb-2" 
              onClick={clearLogs}
            >
              🗑️ Limpar Logs
            </button>
          </div>
        </div>

        <div className="mt-3">
          <h6>📋 Logs de Debug:</h6>
          <div 
            className="bg-dark text-light p-3 rounded" 
            style={{ 
              height: '300px', 
              overflowY: 'auto', 
              fontFamily: 'monospace',
              fontSize: '11px'
            }}
          >
            {logs.length === 0 ? (
              <div className="text-muted">Clique em "Testar Token" para ver os logs...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-3">
          <h6>🔍 Como Verificar se Funciona:</h6>
          <ul className="small">
            <li><strong>Desenvolvimento:</strong> Token deve ser null (normal)</li>
            <li><strong>Produção:</strong> Token deve ser um JWT válido</li>
            <li><strong>Console Firebase:</strong> Vá em App Check → Métricas</li>
            <li><strong>Console Navegador:</strong> Veja os logs acima</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppCheckDebug;
