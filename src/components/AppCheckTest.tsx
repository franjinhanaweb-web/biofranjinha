import React, { useState, useEffect } from 'react';
import { appCheckService } from '../services/appCheckService';
import { Button, Alert, Card, Spinner } from 'react-bootstrap';

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
        
        <div className="d-flex gap-2 mb-3">
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

        <div className="mt-3">
          <h6>Status do App Check:</h6>
          <ul className="list-unstyled">
            <li>
              <strong>Disponível:</strong> {appCheckService.isAvailable() ? '✅ Sim' : '❌ Não'}
            </li>
            <li>
              <strong>reCAPTCHA Site Key:</strong> {process.env.REACT_APP_RECAPTCHA_SITE_KEY ? '✅ Configurado' : '❌ Não configurado'}
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

