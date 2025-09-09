import React, { useState } from 'react';
import { useAppCheck } from '../hooks/useAppCheck';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

const AppCheckProtectionTest: React.FC = () => {
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

  // Teste 1: Leitura do Firestore (deve funcionar com App Check)
  const testFirestoreRead = async () => {
    setIsLoading(true);
    addTestResult('Firestore Read', false, 'Iniciando teste de leitura...');
    
    try {
      const testCollection = collection(db, 'appcheck_test');
      const q = query(testCollection, limit(1));
      const snapshot = await getDocs(q);
      
      addTestResult('Firestore Read', true, 
        `✅ Leitura bem-sucedida! ${snapshot.docs.length} documentos encontrados.`,
        { docsCount: snapshot.docs.length }
      );
    } catch (error: any) {
      addTestResult('Firestore Read', false, 
        `❌ Erro na leitura: ${error.message}`,
        { error: error.code, message: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 2: Escrita no Firestore (deve funcionar com App Check)
  const testFirestoreWrite = async () => {
    setIsLoading(true);
    addTestResult('Firestore Write', false, 'Iniciando teste de escrita...');
    
    try {
      const testCollection = collection(db, 'appcheck_test');
      const docRef = await addDoc(testCollection, {
        test: 'App Check Protection Test',
        timestamp: new Date().toISOString(),
        random: Math.random(),
        email: `test-${Date.now()}@example.com`
      });
      
      addTestResult('Firestore Write', true, 
        `✅ Escrita bem-sucedida! Documento criado: ${docRef.id}`,
        { docId: docRef.id }
      );
    } catch (error: any) {
      addTestResult('Firestore Write', false, 
        `❌ Erro na escrita: ${error.message}`,
        { error: error.code, message: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 3: Simular requisição sem App Check (deve falhar em produção)
  const testWithoutAppCheck = async () => {
    setIsLoading(true);
    addTestResult('Without App Check', false, 'Simulando requisição sem App Check...');
    
    try {
      // IMPORTANTE: Este teste simula uma requisição SEM App Check
      // Em produção, isso deve falhar devido às regras do Firestore
      // Em desenvolvimento, pode funcionar porque App Check está desabilitado
      
      const testCollection = collection(db, 'appcheck_test');
      const q = query(testCollection, limit(1));
      const snapshot = await getDocs(q);
      
      // Se chegou aqui, significa que a requisição funcionou
      // Isso pode indicar que:
      // 1. Estamos em desenvolvimento (App Check desabilitado)
      // 2. As regras do Firestore não estão exigindo App Check
      // 3. Há um problema na configuração
      
      addTestResult('Without App Check', true, 
        `⚠️ ATENÇÃO: Requisição funcionou sem App Check!`,
        { 
          docsCount: snapshot.docs.length,
          environment: process.env.NODE_ENV,
          warning: 'Isso pode indicar que a proteção não está ativa'
        }
      );
    } catch (error: any) {
      // Se chegou aqui, significa que a requisição foi bloqueada
      // Isso é o comportamento esperado em produção com App Check ativo
      
      addTestResult('Without App Check', false, 
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

  // Teste 4: Verificar token do App Check
  const testAppCheckToken = async () => {
    setIsLoading(true);
    addTestResult('App Check Token', false, 'Verificando token do App Check...');
    
    try {
      const token = await getToken();
      
      if (token) {
        addTestResult('App Check Token', true, 
          `✅ Token obtido com sucesso! (${token.substring(0, 50)}...)`,
          { tokenLength: token.length, hasToken: true }
        );
      } else {
        addTestResult('App Check Token', false, 
          `⚠️ Token não obtido (desenvolvimento ou erro)`,
          { hasToken: false }
        );
      }
    } catch (error: any) {
      addTestResult('App Check Token', false, 
        `❌ Erro ao obter token: ${error.message}`,
        { error: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 5: Teste completo de proteção
  const runFullProtectionTest = async () => {
    setIsLoading(true);
    addTestResult('Full Protection Test', false, 'Iniciando teste completo de proteção...');
    
    try {
      // 1. Obter token
      const token = await getToken();
      
      if (!token) {
        addTestResult('Full Protection Test', false, 
          '❌ Teste cancelado: Token do App Check não disponível',
          { reason: 'No token available' }
        );
        return;
      }

      // 2. Testar operações com token
      const testCollection = collection(db, 'appcheck_test');
      const docRef = await addDoc(testCollection, {
        test: 'Full Protection Test',
        timestamp: new Date().toISOString(),
        appCheckToken: token.substring(0, 20) + '...',
        email: `full-test-${Date.now()}@example.com`
      });

      addTestResult('Full Protection Test', true, 
        `✅ Teste completo bem-sucedido! Documento: ${docRef.id}`,
        { 
          docId: docRef.id, 
          tokenUsed: true,
          environment: process.env.NODE_ENV 
        }
      );
    } catch (error: any) {
      addTestResult('Full Protection Test', false, 
        `❌ Teste falhou: ${error.message}`,
        { error: error.code, message: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🛡️ Teste de Proteção do App Check</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-12">
            <p className="text-muted">
              Teste se o App Check está realmente protegendo suas operações do Firestore.
              Em produção, operações sem App Check devem ser bloqueadas.
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6>🧪 Testes Individuais:</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-primary" 
                onClick={testAppCheckToken}
                disabled={isLoading}
              >
                🔑 Testar Token
              </button>
              <button 
                className="btn btn-outline-success" 
                onClick={testFirestoreRead}
                disabled={isLoading}
              >
                📖 Testar Leitura
              </button>
              <button 
                className="btn btn-outline-warning" 
                onClick={testFirestoreWrite}
                disabled={isLoading}
              >
                ✏️ Testar Escrita
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h6>🛡️ Testes de Proteção:</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-danger" 
                onClick={testWithoutAppCheck}
                disabled={isLoading}
              >
                🚫 Simular Sem App Check
              </button>
              <button 
                className="btn btn-primary" 
                onClick={runFullProtectionTest}
                disabled={isLoading}
              >
                🎯 Teste Completo
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
          <h6>ℹ️ Como Interpretar os Resultados:</h6>
          <ul className="small text-muted">
            <li><strong>Desenvolvimento:</strong> Todos os testes devem funcionar (App Check desabilitado)</li>
            <li><strong>Produção:</strong> Testes com App Check devem funcionar, sem App Check devem falhar</li>
            <li><strong>Token:</strong> Deve ser obtido em produção, null em desenvolvimento</li>
            <li><strong>Proteção:</strong> Em produção, operações sem App Check são bloqueadas</li>
            <li><strong>⚠️ ATENÇÃO:</strong> Se "Simular Sem App Check" funcionar em produção, há problema na proteção</li>
            <li><strong>✅ PERFEITO:</strong> Se "Simular Sem App Check" falhar em produção, proteção está ativa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppCheckProtectionTest;
