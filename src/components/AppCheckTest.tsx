import React, { useState } from 'react';
import { appCheckService } from '../services/appCheckService';
import { Button, Alert, Card, Spinner, Row, Col } from 'react-bootstrap';
import AppCheckTester from '../utils/appCheckTester';

/**
 * Componente para testar o funcionamento do App Check
 * Útil para verificar se a configuração está correta
 */
const AppCheckTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    token?: string;
  } | null>(null);

  const [advancedTests, setAdvancedTests] = useState<any>(null);

  const testAppCheck = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Verificar se o App Check está disponível
      if (!appCheckService.isAvailable()) {
        setTestResult({
          success: false,
          message: 'App Check não está configurado ou disponível'
        });
        return;
      }

      // Testar obtenção de token
      const token = await appCheckService.getToken();
      
      if (token) {
        setTestResult({
          success: true,
          message: 'App Check funcionando corretamente!',
          token: token.substring(0, 20) + '...' // Mostrar apenas parte do token
        });
      } else {
        setTestResult({
          success: false,
          message: 'Falha ao obter token do App Check'
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Erro: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testFirestoreWithAppCheck = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Testar acesso ao Firestore com App Check
      const { db } = await import('../config/firebase');
      const { collection, getDocs } = await import('firebase/firestore');
      
      // Tentar acessar uma coleção (isso deve ser protegido pelo App Check)
      const testCollection = collection(db, 'test-appcheck');
      const snapshot = await getDocs(testCollection);
      
      setTestResult({
        success: true,
        message: `Firestore acessado com sucesso! Documentos encontrados: ${snapshot.size}`,
        token: 'Firestore protegido pelo App Check'
      });
    } catch (error: any) {
      if (error.code === 'app-check-token-expired' || error.code === 'app-check-token-invalid') {
        setTestResult({
          success: false,
          message: '❌ App Check bloqueou acesso - Token inválido ou expirado'
        });
      } else if (error.code === 'permission-denied') {
        setTestResult({
          success: false,
          message: '❌ App Check bloqueou acesso - Permissão negada'
        });
      } else {
        setTestResult({
          success: false,
          message: `Erro no Firestore: ${error.message}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testWithRefresh = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const token = await appCheckService.getTokenWithRefresh();
      
      if (token) {
        setTestResult({
          success: true,
          message: 'Token obtido com refresh automático!',
          token: token.substring(0, 20) + '...'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Falha ao obter token com refresh'
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Erro: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAdvancedTests = async () => {
    setIsLoading(true);
    setAdvancedTests(null);

    try {
      const results = await AppCheckTester.runAllTests();
      setAdvancedTests(results);
    } catch (error: any) {
      setAdvancedTests({
        error: `Erro ao executar testes: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">🔐 Teste do Firebase App Check</h5>
      </Card.Header>
      <Card.Body>
        <p className="text-muted">
          Este componente testa se o App Check está funcionando corretamente.
          Use apenas em desenvolvimento para verificar a configuração.
        </p>
        
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Button 
            variant="primary" 
            onClick={testAppCheck}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Testar App Check'}
          </Button>
          
          <Button 
            variant="outline-primary" 
            onClick={testWithRefresh}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Testar com Refresh'}
          </Button>

          <Button 
            variant="warning" 
            onClick={testFirestoreWithAppCheck}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Testar Firestore'}
          </Button>

          <Button 
            variant="danger" 
            onClick={runAdvancedTests}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Testes Avançados'}
          </Button>
        </div>

        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'danger'}>
            <strong>
              {testResult.success ? '✅ Sucesso!' : '❌ Erro!'}
            </strong>
            <br />
            {testResult.message}
            {testResult.token && (
              <>
                <br />
                <small className="text-muted">
                  Token: <code>{testResult.token}</code>
                </small>
              </>
            )}
          </Alert>
        )}

        {advancedTests && (
          <div className="mt-4">
            <h6>🧪 Resultados dos Testes Avançados:</h6>
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Acesso Normal</h6>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant={advancedTests.normalAccess?.success ? 'success' : 'danger'}>
                      {advancedTests.normalAccess?.message}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Rate Limiting</h6>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant={advancedTests.rateLimiting?.success ? 'success' : 'warning'}>
                      {advancedTests.rateLimiting?.message}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Permissão de Escrita</h6>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant={advancedTests.writePermission?.success ? 'success' : 'danger'}>
                      {advancedTests.writePermission?.message}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Token Inválido</h6>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant={advancedTests.invalidToken?.success ? 'success' : 'danger'}>
                      {advancedTests.invalidToken?.message}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        <div className="mt-3">
          <h6>Status do App Check:</h6>
          <ul className="list-unstyled">
            <li>
              <strong>Disponível:</strong> {appCheckService.isAvailable() ? '✅ Sim' : '❌ Não'}
            </li>
            <li>
              <strong>reCAPTCHA Site Key:</strong> {process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z' ? '✅ Configurado' : '❌ Não configurado'}
            </li>
            <li>
              <strong>Site Key (atual):</strong> <code>{process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfWqsIrAAAAAJAj86oKq2uD7ELdYYZNsQeA2v1z'}</code>
            </li>
            <li>
              <strong>Debug Token:</strong> {process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN ? '✅ Configurado' : '⚠️ Não configurado (opcional)'}
            </li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppCheckTest;

