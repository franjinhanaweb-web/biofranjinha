import React, { useState, useEffect } from 'react';
import { useAppCheck } from '../hooks/useAppCheck';

const AppCheckDiagnostic: React.FC = () => {
  const { isReady, error, getToken } = useAppCheck();
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDiagnostic = (category: string, status: 'success' | 'warning' | 'error' | 'info', message: string, details?: any) => {
    const diagnostic = {
      id: Date.now(),
      category,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setDiagnostics(prev => [diagnostic, ...prev]);
  };

  const runFullDiagnostic = async () => {
    setIsLoading(true);
    setDiagnostics([]);
    
    // 1. Verificar ambiente
    addDiagnostic('Ambiente', 'info', `NODE_ENV: ${process.env.NODE_ENV}`);
    addDiagnostic('Ambiente', 'info', `Hostname: ${window.location.hostname}`);
    
    // 2. Verificar variáveis de ambiente
    const hasRecaptchaKey = !!process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    const hasFirebaseKey = !!process.env.REACT_APP_FIREBASE_API_KEY;
    const hasProjectId = !!process.env.REACT_APP_FIREBASE_PROJECT_ID;
    
    addDiagnostic('Variáveis', hasRecaptchaKey ? 'success' : 'error', 
      `reCAPTCHA Key: ${hasRecaptchaKey ? 'Configurada' : 'NÃO CONFIGURADA'}`);
    addDiagnostic('Variáveis', hasFirebaseKey ? 'success' : 'error', 
      `Firebase API Key: ${hasFirebaseKey ? 'Configurada' : 'NÃO CONFIGURADA'}`);
    addDiagnostic('Variáveis', hasProjectId ? 'success' : 'error', 
      `Project ID: ${hasProjectId ? 'Configurada' : 'NÃO CONFIGURADA'}`);
    
    if (hasRecaptchaKey) {
      addDiagnostic('Variáveis', 'info', `reCAPTCHA Key: ${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`);
    }
    if (hasProjectId) {
      addDiagnostic('Variáveis', 'info', `Project ID: ${process.env.REACT_APP_FIREBASE_PROJECT_ID}`);
    }
    
    // 3. Verificar reCAPTCHA
    const isRecaptchaLoaded = typeof window.grecaptcha !== 'undefined';
    const isRecaptchaReady = isRecaptchaLoaded && window.grecaptcha && window.grecaptcha.ready;
    
    addDiagnostic('reCAPTCHA', isRecaptchaLoaded ? 'success' : 'error', 
      `reCAPTCHA carregado: ${isRecaptchaLoaded ? 'Sim' : 'Não'}`);
    
    if (isRecaptchaLoaded) {
      addDiagnostic('reCAPTCHA', isRecaptchaReady ? 'success' : 'warning', 
        `reCAPTCHA pronto: ${isRecaptchaReady ? 'Sim' : 'Não'}`);
    }
    
    // 4. Verificar App Check
    addDiagnostic('App Check', isReady ? 'success' : 'warning', 
      `App Check pronto: ${isReady ? 'Sim' : 'Não'}`);
    
    if (error) {
      addDiagnostic('App Check', 'error', `Erro: ${error}`);
    }
    
    // 5. Testar token (apenas em produção)
    if (process.env.NODE_ENV === 'production') {
      try {
        addDiagnostic('Token', 'info', 'Tentando obter token...');
        const token = await getToken();
        
        if (token) {
          addDiagnostic('Token', 'success', 
            `Token obtido com sucesso! (${token.substring(0, 50)}...)`);
        } else {
          addDiagnostic('Token', 'error', 'Token não obtido');
        }
      } catch (err: any) {
        addDiagnostic('Token', 'error', `Erro ao obter token: ${err.message}`);
      }
    } else {
      addDiagnostic('Token', 'info', 'Desenvolvimento: Token não necessário');
    }
    
    // 6. Verificar console do navegador
    addDiagnostic('Console', 'info', 'Verifique o console do navegador (F12) para mais detalhes');
    
    setIsLoading(false);
  };

  const clearDiagnostics = () => {
    setDiagnostics([]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🔍 Diagnóstico Completo do App Check</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-12">
            <p className="text-muted">
              Execute um diagnóstico completo para identificar problemas com o App Check.
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary" 
                onClick={runFullDiagnostic}
                disabled={isLoading}
              >
                {isLoading ? 'Executando...' : '🔍 Executar Diagnóstico Completo'}
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={clearDiagnostics}
              >
                🗑️ Limpar Diagnósticos
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            Executando diagnóstico...
          </div>
        )}

        <div className="mt-3">
          <h6>📋 Resultados do Diagnóstico:</h6>
          <div 
            className="bg-light p-3 rounded" 
            style={{ 
              maxHeight: '500px', 
              overflowY: 'auto'
            }}
          >
            {diagnostics.length === 0 ? (
              <div className="text-muted">Nenhum diagnóstico executado ainda...</div>
            ) : (
              diagnostics.map((diagnostic) => (
                <div key={diagnostic.id} className={`alert ${
                  diagnostic.status === 'success' ? 'alert-success' : 
                  diagnostic.status === 'warning' ? 'alert-warning' : 
                  diagnostic.status === 'error' ? 'alert-danger' : 'alert-info'
                } mb-2`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>[{diagnostic.timestamp}] {diagnostic.category}:</strong> {diagnostic.message}
                      {diagnostic.details && (
                        <details className="mt-2">
                          <summary>Detalhes</summary>
                          <pre className="small mt-2 mb-0">{JSON.stringify(diagnostic.details, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                    <span className={`badge ${
                      diagnostic.status === 'success' ? 'bg-success' : 
                      diagnostic.status === 'warning' ? 'bg-warning' : 
                      diagnostic.status === 'error' ? 'bg-danger' : 'bg-info'
                    }`}>
                      {diagnostic.status === 'success' ? '✅' : 
                       diagnostic.status === 'warning' ? '⚠️' : 
                       diagnostic.status === 'error' ? '❌' : 'ℹ️'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-3">
          <h6>ℹ️ Interpretação dos Resultados:</h6>
          <ul className="small text-muted">
            <li><strong>✅ Sucesso:</strong> Configuração correta</li>
            <li><strong>⚠️ Aviso:</strong> Pode funcionar, mas não é ideal</li>
            <li><strong>❌ Erro:</strong> Problema que precisa ser corrigido</li>
            <li><strong>ℹ️ Info:</strong> Informação adicional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppCheckDiagnostic;
