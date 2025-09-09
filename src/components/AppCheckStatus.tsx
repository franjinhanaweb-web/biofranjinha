import React, { useState, useEffect } from 'react';
import { useAppCheck } from '../hooks/useAppCheck';

const AppCheckStatus: React.FC = () => {
  const { isReady, error, getToken } = useAppCheck();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog(`App Check Status: ${isReady ? 'Pronto' : 'Carregando...'}`);
    if (error) {
      addLog(`Erro: ${error}`);
    }
  }, [isReady, error]);

  const handleGetToken = async () => {
    setIsLoading(true);
    addLog('Solicitando token do App Check...');
    
    try {
      const appCheckToken = await getToken();
      if (appCheckToken) {
        setToken(appCheckToken);
        addLog(`✅ Token obtido com sucesso! (${appCheckToken.substring(0, 20)}...)`);
      } else {
        addLog('⚠️ Token não foi obtido (modo desenvolvimento ou erro)');
      }
    } catch (err) {
      addLog(`❌ Erro ao obter token: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setToken(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🔒 App Check Status</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-secondary me-2">Status</span>
              <span className={`badge ${isReady ? 'bg-success' : 'bg-warning'}`}>
                {isReady ? '✅ Pronto' : '⏳ Carregando...'}
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-secondary me-2">Ambiente</span>
              <span className={`badge ${process.env.NODE_ENV === 'production' ? 'bg-danger' : 'bg-info'}`}>
                {process.env.NODE_ENV === 'production' ? '🚀 Produção' : '🛠️ Desenvolvimento'}
              </span>
            </div>
            {error && (
              <div className="alert alert-danger mt-2">
                <strong>Erro:</strong> {error}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <button 
              className="btn btn-primary me-2" 
              onClick={handleGetToken}
              disabled={!isReady || isLoading}
            >
              {isLoading ? '⏳ Obtendo Token...' : '🔑 Obter Token'}
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={clearLogs}
            >
              🗑️ Limpar
            </button>
          </div>
        </div>

        {token && (
          <div className="alert alert-success">
            <strong>Token do App Check:</strong>
            <br />
            <code className="small">{token}</code>
          </div>
        )}

        <div className="mt-3">
          <h6>📋 Logs do App Check:</h6>
          <div 
            className="bg-dark text-light p-3 rounded" 
            style={{ 
              height: '200px', 
              overflowY: 'auto', 
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          >
            {logs.length === 0 ? (
              <div className="text-muted">Nenhum log ainda...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-3">
          <h6>ℹ️ Informações:</h6>
          <ul className="small text-muted">
            <li><strong>Desenvolvimento:</strong> App Check desabilitado, operações funcionam normalmente</li>
            <li><strong>Produção:</strong> App Check ativo, protege contra bots e scripts maliciosos</li>
            <li><strong>Token:</strong> Renovado automaticamente a cada 1 hora</li>
            <li><strong>reCAPTCHA:</strong> Carregado automaticamente em produção</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppCheckStatus;
