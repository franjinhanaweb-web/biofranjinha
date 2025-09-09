import React, { useState } from 'react';
import { Card, Button, Alert, Table, Form, InputGroup } from 'react-bootstrap';
import { collection, getDocs, addDoc, query, where, orderBy, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { db } from '../../config/firebase';
import { validateVerificationCode } from '../../services/verificationCodeService';

interface DebugInfo {
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
  data?: any;
}

const DebugPage: React.FC = () => {
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [testCode, setTestCode] = useState('70373ba3-4c1c-4a1b-938c-d6f85ad11044');
  const [allCodes, setAllCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (type: 'success' | 'error' | 'info', message: string, data?: any) => {
    const newLog: DebugInfo = {
      type,
      message,
      timestamp: new Date(),
      data
    };
    setDebugLogs(prev => [newLog, ...prev.slice(0, 19)]); // Manter apenas 20 logs
  };

  // Teste 1: Verificar configuração e conexão com Firebase
  const testFirebaseConnection = async () => {
    try {
      addLog('info', 'Testando configuração do Firebase...');
      
      // Verificar variáveis de ambiente
      const config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
      };
      
      addLog('info', `API Key: ${config.apiKey ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
      addLog('info', `Project ID: ${config.projectId || 'NÃO DEFINIDO'}`);
      addLog('info', `Auth Domain: ${config.authDomain || 'NÃO DEFINIDO'}`);
      addLog('info', `Storage Bucket: ${config.storageBucket || 'NÃO DEFINIDO'}`);
      addLog('info', `App ID: ${config.appId || 'NÃO DEFINIDO'}`);
      
      if (!config.apiKey || !config.projectId) {
        addLog('error', 'Configuração do Firebase incompleta! Verifique as variáveis de ambiente.');
        return;
      }
      
      // Testar inicialização do Firebase
      addLog('info', 'Testando inicialização do Firebase...');
      let testApp;
      try {
        testApp = initializeApp(config);
        addLog('success', 'Firebase inicializado com sucesso');
      } catch (initError: any) {
        addLog('error', `Erro na inicialização: ${initError.message}`);
        return;
      }
      
      addLog('info', 'Testando conexão com Firestore...');
      
      // Testar conexão com banco específico
      try {
        const testDb = getFirestore(testApp, 'biodefranja');
        addLog('info', 'Banco biodefranja configurado');
        
        const codesRef = collection(testDb, 'Codes_bioSite');
        const snapshot = await getDocs(codesRef);
        addLog('success', `Conexão OK! Encontrados ${snapshot.size} códigos na coleção biodefranja`);
      } catch (dbError: any) {
        addLog('error', `Erro ao conectar com banco biodefranja: ${dbError.message}`);
        addLog('error', `Código do erro: ${dbError.code || 'N/A'}`);
        
        // Tentar com banco padrão
        addLog('info', 'Tentando com banco padrão...');
        try {
          const codesRef = collection(db, 'Codes_bioSite');
          const snapshot = await getDocs(codesRef);
          addLog('success', `Conexão OK com banco padrão! Encontrados ${snapshot.size} códigos`);
        } catch (defaultError: any) {
          addLog('error', `Erro também com banco padrão: ${defaultError.message}`);
        }
      }
    } catch (error: any) {
      addLog('error', `Erro de conexão: ${error.message}`);
      addLog('error', `Código do erro: ${error.code || 'N/A'}`);
    }
  };

  // Teste 2: Listar todos os códigos
  const listAllCodes = async () => {
    try {
      setLoading(true);
      addLog('info', 'Buscando todos os códigos...');
      const codesRef = collection(db, 'Codes_bioSite');
      const q = query(codesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const codes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      setAllCodes(codes);
      addLog('success', `Encontrados ${codes.length} códigos`);
      
      // Mostrar alguns códigos no log
      codes.slice(0, 3).forEach(code => {
        addLog('info', `Código: ${code.code}, Usado: ${code.isUsed}`);
      });
    } catch (error: any) {
      addLog('error', `Erro ao buscar códigos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Teste 3: Validar código específico
  const validateSpecificCode = async () => {
    try {
      setLoading(true);
      addLog('info', `Validando código: ${testCode}`);
      const result = await validateVerificationCode(testCode);
      
      if (result.isValid) {
        addLog('success', `Código VÁLIDO: ${result.message}`);
        addLog('info', `Dados: ${JSON.stringify(result.codeData, null, 2)}`);
      } else {
        addLog('error', `Código INVÁLIDO: ${result.message}`);
      }
    } catch (error: any) {
      addLog('error', `Erro na validação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Teste 4: Criar código de teste
  const createTestCode = async () => {
    try {
      setLoading(true);
      addLog('info', 'Criando código de teste...');
      const codesRef = collection(db, 'Codes_bioSite');
      const newCode = {
        code: `test-${Date.now()}`,
        isUsed: false,
        createdAt: new Date(),
        createdBy: 'debug-page'
      };
      
      const docRef = await addDoc(codesRef, newCode);
      addLog('success', `Código de teste criado com ID: ${docRef.id}`);
    } catch (error: any) {
      addLog('error', `Erro ao criar código: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Teste 5: Buscar código específico
  const searchSpecificCode = async () => {
    try {
      setLoading(true);
      addLog('info', `Buscando código específico: ${testCode}`);
      const codesRef = collection(db, 'Codes_bioSite');
      const q = query(codesRef, where('code', '==', testCode));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        addLog('error', 'Código NÃO ENCONTRADO no banco de dados');
      } else {
        const codeData = snapshot.docs[0].data();
        addLog('success', 'Código ENCONTRADO!');
        addLog('info', `Dados: ${JSON.stringify(codeData, null, 2)}`);
      }
    } catch (error: any) {
      addLog('error', `Erro na busca: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Limpar logs
  const clearLogs = () => {
    setDebugLogs([]);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🔧 Debug - Teste de Conexão Firebase</h1>
      
      {/* Controles de Teste */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Testes de Conexão e Validação</h5>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>Código para testar:</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  placeholder="Digite um código UUID"
                />
              </InputGroup>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button 
              variant="primary" 
              onClick={testFirebaseConnection}
              disabled={loading}
            >
              🔌 Testar Conexão
            </Button>
            
            <Button 
              variant="info" 
              onClick={listAllCodes}
              disabled={loading}
            >
              📋 Listar Códigos
            </Button>
            
            <Button 
              variant="warning" 
              onClick={searchSpecificCode}
              disabled={loading}
            >
              🔍 Buscar Código
            </Button>
            
            <Button 
              variant="success" 
              onClick={validateSpecificCode}
              disabled={loading}
            >
              ✅ Validar Código
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={createTestCode}
              disabled={loading}
            >
              ➕ Criar Teste
            </Button>
            
            <Button 
              variant="outline-danger" 
              onClick={clearLogs}
            >
              🗑️ Limpar Logs
            </Button>
          </div>
          
          {loading && (
            <Alert variant="info">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Processando...
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Logs de Debug */}
      <Card className="mb-4">
        <Card.Header>
          <h5>📝 Logs de Debug</h5>
        </Card.Header>
        <Card.Body>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {debugLogs.length === 0 ? (
              <p className="text-muted">Nenhum log ainda. Execute alguns testes!</p>
            ) : (
              debugLogs.map((log, index) => (
                <Alert 
                  key={index} 
                  variant={log.type === 'error' ? 'danger' : log.type === 'success' ? 'success' : 'info'}
                  className="mb-2"
                >
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>[{log.timestamp.toLocaleTimeString()}]</strong> {log.message}
                    </span>
                  </div>
                  {log.data && (
                    <pre className="mt-2 mb-0" style={{ fontSize: '0.8em' }}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </Alert>
              ))
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Tabela de Códigos */}
      {allCodes.length > 0 && (
        <Card>
          <Card.Header>
            <h5>📊 Códigos Encontrados ({allCodes.length})</h5>
          </Card.Header>
          <Card.Body>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Usado</th>
                    <th>Criado em</th>
                    <th>Usado por</th>
                  </tr>
                </thead>
                <tbody>
                  {allCodes.map((code, index) => (
                    <tr key={index}>
                      <td>{code.id}</td>
                      <td>
                        <code>{code.code}</code>
                      </td>
                      <td>
                        <span className={`badge ${code.isUsed ? 'bg-danger' : 'bg-success'}`}>
                          {code.isUsed ? 'Usado' : 'Disponível'}
                        </span>
                      </td>
                      <td>
                        {code.createdAt ? new Date(code.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                      </td>
                      <td>{code.usedBy || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DebugPage;
