import React, { useState } from 'react';
import { Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { populateVerificationCodes, listVerificationCodes } from '../../utils/populateVerificationCodes';
import styles from './CodeManager.module.css';

interface CodeInfo {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

const CodeManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [codes, setCodes] = useState<CodeInfo[]>([]);
  const [showCodes, setShowCodes] = useState(false);

  const handlePopulateCodes = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await populateVerificationCodes(50);
      setMessage({ type: 'success', text: '50 códigos de verificação foram criados com sucesso!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erro ao criar códigos: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleListCodes = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Simular listagem (em um ambiente real, você implementaria a função listVerificationCodes)
      setMessage({ type: 'info', text: 'Função de listagem será implementada em breve.' });
      setShowCodes(true);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erro ao listar códigos: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.codeManagerContainer}>
      <Card className={styles.codeManagerCard}>
        <Card.Header>
          <h4>🔧 Gerenciador de Códigos de Verificação</h4>
        </Card.Header>
        <Card.Body>
          {message && (
            <Alert variant={message.type === 'error' ? 'danger' : message.type === 'success' ? 'success' : 'info'}>
              {message.text}
            </Alert>
          )}

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              onClick={handlePopulateCodes}
              disabled={loading}
              className={styles.actionButton}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Criando...
                </>
              ) : (
                '🚀 Criar 50 Códigos'
              )}
            </Button>

            <Button
              variant="outline-secondary"
              onClick={handleListCodes}
              disabled={loading}
              className={styles.actionButton}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Carregando...
                </>
              ) : (
                '📋 Listar Códigos'
              )}
            </Button>
          </div>

          <div className={styles.infoSection}>
            <h6>ℹ️ Informações:</h6>
            <ul>
              <li>Os códigos são gerados no formato UUID (ex: 61749772-f947-4cd8-859e-d9b6d48ea812)</li>
              <li>Cada código é único e pode ser usado apenas uma vez</li>
              <li>Os códigos são salvos na coleção <code>users_codes</code> do Firebase</li>
              <li>Após o uso, o código fica associado ao usuário que o utilizou</li>
            </ul>
          </div>

          {showCodes && (
            <div className={styles.codesList}>
              <h6>📋 Códigos Criados:</h6>
              <Alert variant="info">
                Para ver os códigos criados, verifique o console do navegador ou a coleção 'users_codes' no Firebase Console.
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CodeManager;
