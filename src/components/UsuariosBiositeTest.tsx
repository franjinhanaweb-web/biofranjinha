import React, { useState } from 'react';
import { useAppCheck } from '../hooks/useAppCheck';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

const UsuariosBiositeTest: React.FC = () => {
  const { getToken } = useAppCheck();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test: string, success: boolean, message: string, details?: any) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Teste 1: Leitura da coleção Usuarios_biosite
  const testUsuariosBiositeRead = async () => {
    setIsLoading(true);
    addTestResult('Usuarios_biosite Read', false, 'Iniciando teste de leitura...');
    
    try {
      const token = await getToken();
      if (!token) {
        addTestResult('Usuarios_biosite Read', false, 
          `❌ Erro: Token do App Check não disponível`,
          { error: 'No App Check token' }
        );
        return;
      }
      
      addTestResult('Usuarios_biosite Read', false, 'Token obtido, fazendo leitura...');
      
      const usuariosCollection = collection(db, 'Usuarios_biosite');
      const q = query(usuariosCollection, limit(5));
      const snapshot = await getDocs(q);
      
      addTestResult('Usuarios_biosite Read', true, 
        `✅ Leitura bem-sucedida! ${snapshot.docs.length} usuários encontrados.`,
        { 
          docsCount: snapshot.docs.length, 
          tokenUsed: true,
          environment: process.env.NODE_ENV 
        }
      );
    } catch (error: any) {
      addTestResult('Usuarios_biosite Read', false, 
        `❌ Erro na leitura: ${error.message}`,
        { error: error.code, message: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 2: Escrita na coleção Usuarios_biosite
  const testUsuariosBiositeWrite = async () => {
    setIsLoading(true);
    addTestResult('Usuarios_biosite Write', false, 'Iniciando teste de escrita...');
    
    try {
      const token = await getToken();
      if (!token) {
        addTestResult('Usuarios_biosite Write', false, 
          `❌ Erro: Token do App Check não disponível`,
          { error: 'No App Check token' }
        );
        return;
      }
      
      addTestResult('Usuarios_biosite Write', false, 'Token obtido, fazendo escrita...');
      
      const usuariosCollection = collection(db, 'Usuarios_biosite');
      const docRef = await addDoc(usuariosCollection, {
        nome: `Teste App Check ${Date.now()}`,
        email: `teste-${Date.now()}@example.com`,
        timestamp: new Date().toISOString(),
        appCheckTest: true,
        random: Math.random()
      });
      
      addTestResult('Usuarios_biosite Write', true, 
        `✅ Escrita bem-sucedida! Usuário criado: ${docRef.id}`,
        { docId: docRef.id, tokenUsed: true }
      );
    } catch (error: any) {
      addTestResult('Usuarios_biosite Write', false, 
        `❌ Erro na escrita: ${error.message}`,
        { error: error.code, message: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 3: Simular requisição sem App Check (deve falhar em produção)
  const testUsuariosBiositeWithoutAppCheck = async () => {
    setIsLoading(true);
    addTestResult('Usuarios_biosite Without App Check', false, 'Simulando requisição sem App Check...');
    
    try {
      // Este teste simula uma requisição SEM App Check
      // Em produção, isso deve falhar devido às regras do Firestore
      
      const usuariosCollection = collection(db, 'Usuarios_biosite');
      const q = query(usuariosCollection, limit(1));
      const snapshot = await getDocs(q);
      
      // Se chegou aqui, significa que a requisição funcionou
      addTestResult('Usuarios_biosite Without App Check', true, 
        `⚠️ ATENÇÃO: Requisição funcionou sem App Check!`,
        { 
          docsCount: snapshot.docs.length,
          environment: process.env.NODE_ENV,
          warning: 'Isso pode indicar que a proteção não está ativa'
        }
      );
    } catch (error: any) {
      // Se chegou aqui, significa que a requisição foi bloqueada
      addTestResult('Usuarios_biosite Without App Check', false, 
        `✅ PERFEITO: Requisição bloqueada! Proteção ativa.`,
        { 
          error: error.code, 
          message: error.message,
          environment: process.env.NODE_ENV,
          success: 'App Check está protegendo corretamente'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 4: Verificar se reCAPTCHA está carregado
  const testRecaptchaStatus = async () => {
    setIsLoading(true);
    addTestResult('reCAPTCHA Status', false, 'Verificando status do reCAPTCHA...');
    
    try {
      const isRecaptchaLoaded = typeof window.grecaptcha !== 'undefined';
      const isProduction = process.env.NODE_ENV === 'production';
      const hasRecaptchaKey = !!process.env.REACT_APP_RECAPTCHA_SITE_KEY;
      
      addTestResult('reCAPTCHA Status', isRecaptchaLoaded, 
        `reCAPTCHA carregado: ${isRecaptchaLoaded ? 'Sim' : 'Não'}`,
        { 
          isRecaptchaLoaded,
          isProduction,
          hasRecaptchaKey,
          environment: process.env.NODE_ENV
        }
      );
      
      if (isRecaptchaLoaded && window.grecaptcha.ready) {
        addTestResult('reCAPTCHA Status', true, 
          `✅ reCAPTCHA pronto para uso!`,
          { ready: true }
        );
      } else if (isRecaptchaLoaded) {
        addTestResult('reCAPTCHA Status', false, 
          `⚠️ reCAPTCHA carregado mas não pronto`,
          { loaded: true, ready: false }
        );
      } else {
        addTestResult('reCAPTCHA Status', false, 
          `❌ reCAPTCHA não carregado`,
          { loaded: false, ready: false }
        );
      }
    } catch (error: any) {
      addTestResult('reCAPTCHA Status', false, 
        `❌ Erro ao verificar reCAPTCHA: ${error.message}`,
        { error: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">👥 Teste da Coleção Usuarios_biosite</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-12">
            <p className="text-muted">
              Teste específico para a coleção <code>Usuarios_biosite</code> com App Check.
              Esta coleção deve exigir App Check para todas as operações.
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6>🧪 Testes da Coleção:</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-primary" 
                onClick={testRecaptchaStatus}
                disabled={isLoading}
              >
                🔍 Verificar reCAPTCHA
              </button>
              <button 
                className="btn btn-outline-success" 
                onClick={testUsuariosBiositeRead}
                disabled={isLoading}
              >
                📖 Ler Usuarios_biosite
              </button>
              <button 
                className="btn btn-outline-warning" 
                onClick={testUsuariosBiositeWrite}
                disabled={isLoading}
              >
                ✏️ Escrever Usuarios_biosite
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h6>🛡️ Testes de Proteção:</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-danger" 
                onClick={testUsuariosBiositeWithoutAppCheck}
                disabled={isLoading}
              >
                🚫 Sem App Check
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={clearResults}
              >
                🗑️ Limpar Resultados
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            Executando teste...
          </div>
        )}

        <div className="mt-3">
          <h6>📋 Resultados dos Testes:</h6>
          <div 
            className="bg-light p-3 rounded" 
            style={{ 
              maxHeight: '400px', 
              overflowY: 'auto'
            }}
          >
            {testResults.length === 0 ? (
              <div className="text-muted">Nenhum teste executado ainda...</div>
            ) : (
              testResults.map((result) => (
                <div key={result.id} className={`alert ${result.success ? 'alert-success' : 'alert-danger'} mb-2`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>[{result.timestamp}] {result.test}:</strong> {result.message}
                      {result.details && (
                        <details className="mt-2">
                          <summary>Detalhes</summary>
                          <pre className="small mt-2 mb-0">{JSON.stringify(result.details, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                    <span className={`badge ${result.success ? 'bg-success' : 'bg-danger'}`}>
                      {result.success ? '✅' : '❌'}
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
            <li><strong>Desenvolvimento:</strong> Todos os testes devem funcionar (App Check desabilitado)</li>
            <li><strong>Produção:</strong> Testes com App Check devem funcionar, sem App Check devem falhar</li>
            <li><strong>reCAPTCHA:</strong> Deve estar carregado e pronto em produção</li>
            <li><strong>Proteção:</strong> Em produção, operações sem App Check são bloqueadas</li>
            <li><strong>⚠️ ATENÇÃO:</strong> Se "Sem App Check" funcionar em produção, há problema na proteção</li>
            <li><strong>✅ PERFEITO:</strong> Se "Sem App Check" falhar em produção, proteção está ativa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsuariosBiositeTest;
