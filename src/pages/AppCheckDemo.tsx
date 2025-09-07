import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { appCheckService } from '../services/appCheckService';
import AppCheckTest from '../components/AppCheckTest';

/**
 * Página de demonstração do App Check
 * Mostra como usar e testar o Firebase App Check
 */
const AppCheckDemo: React.FC = () => {
  const [appCheckStatus, setAppCheckStatus] = useState<{
    available: boolean;
    token: string | null;
    lastUpdate: Date | null;
  }>({
    available: false,
    token: null,
    lastUpdate: null
  });

  const [isLoading, setIsLoading] = useState(false);

  // Verificar status do App Check ao carregar a página
  useEffect(() => {
    checkAppCheckStatus();
  }, []);

  const checkAppCheckStatus = async () => {
    setIsLoading(true);
    
    try {
      const available = appCheckService.isAvailable();
      const token = available ? await appCheckService.getToken() : null;
      
      setAppCheckStatus({
        available,
        token,
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Erro ao verificar App Check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    setIsLoading(true);
    
    try {
      const token = await appCheckService.getTokenWithRefresh();
      setAppCheckStatus(prev => ({
        ...prev,
        token,
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="mb-4">🔐 Firebase App Check - Demonstração</h1>
          
          {/* Status do App Check */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Status do App Check</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Disponível:</strong>{' '}
                    <Badge bg={appCheckStatus.available ? 'success' : 'danger'}>
                      {appCheckStatus.available ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Token:</strong>{' '}
                    {appCheckStatus.token ? (
                      <Badge bg="success">
                        {appCheckStatus.token.substring(0, 20)}...
                      </Badge>
                    ) : (
                      <Badge bg="secondary">Não disponível</Badge>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <strong>Última atualização:</strong>{' '}
                    {appCheckStatus.lastUpdate ? 
                      appCheckStatus.lastUpdate.toLocaleTimeString() : 
                      'Nunca'
                    }
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      onClick={checkAppCheckStatus}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verificando...' : 'Verificar Status'}
                    </Button>
                    
                    <Button 
                      variant="outline-primary" 
                      onClick={refreshToken}
                      disabled={isLoading || !appCheckStatus.available}
                    >
                      Renovar Token
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Configuração */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Configuração Atual</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>reCAPTCHA Site Key:</strong>{' '}
                    {process.env.REACT_APP_RECAPTCHA_SITE_KEY ? (
                      <Badge bg="success">Configurado</Badge>
                    ) : (
                      <Badge bg="danger">Não configurado</Badge>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Debug Token:</strong>{' '}
                    {process.env.REACT_APP_APP_CHECK_DEBUG_TOKEN ? (
                      <Badge bg="success">Configurado</Badge>
                    ) : (
                      <Badge bg="warning">Não configurado (opcional)</Badge>
                    )}
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Ambiente:</strong>{' '}
                    <Badge bg={process.env.NODE_ENV === 'production' ? 'primary' : 'info'}>
                      {process.env.NODE_ENV}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <strong>Firebase App ID:</strong>{' '}
                    {process.env.REACT_APP_FIREBASE_APP_ID ? (
                      <Badge bg="success">Configurado</Badge>
                    ) : (
                      <Badge bg="danger">Não configurado</Badge>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Instruções */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Como Configurar</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li>
                  <strong>Firebase Console:</strong> Configure o App Check com reCAPTCHA v3
                </li>
                <li>
                  <strong>Cloudflare Pages:</strong> Adicione as variáveis de ambiente necessárias
                </li>
                <li>
                  <strong>Desenvolvimento:</strong> Configure o debug token para testes locais
                </li>
                <li>
                  <strong>Produção:</strong> Remova o debug token e use apenas reCAPTCHA
                </li>
              </ol>
              
              <Alert variant="info" className="mt-3">
                <strong>Dica:</strong> Consulte o arquivo <code>APP_CHECK_SETUP.md</code> para 
                instruções detalhadas de configuração.
              </Alert>
            </Card.Body>
          </Card>

          {/* Componente de Teste */}
          <AppCheckTest />
        </Col>
      </Row>
    </Container>
  );
};

export default AppCheckDemo;

