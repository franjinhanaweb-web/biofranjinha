import React, { useState } from 'react';
import { Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { listVerificationCodes } from '../../utils/populateVerificationCodes';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
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


  const handleListCodes = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await listVerificationCodes();
      setMessage({ type: 'success', text: 'Códigos listados com sucesso! Verifique o console do navegador.' });
      setShowCodes(true);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erro ao listar códigos: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const addTestCode = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const codesRef = collection(db, 'users_codes');
      const testCode = {
        code: 'e38cafd3-9587-43a7-9be9-7ce152b5cb61',
        isUsed: false
      };
      
      await addDoc(codesRef, testCode);
      setMessage({ type: 'success', text: 'Código de teste adicionado com isUsed: false!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erro ao adicionar código de teste: ${error.message}` });
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

            <Button
              variant="outline-warning"
              onClick={addTestCode}
              disabled={loading}
              className={styles.actionButton}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Adicionando...
                </>
              ) : (
                '🧪 Adicionar Código de Teste'
              )}
            </Button>
          </div>

          <div className={styles.infoSection}>
            <h6>ℹ️ Informações:</h6>
            <ul>
              <li>Os códigos devem ser adicionados manualmente no Firebase</li>
              <li>Formato recomendado: UUID (ex: 61749772-f947-4cd8-859e-d9b6d48ea812)</li>
              <li>Cada código é único e pode ser usado apenas uma vez</li>
              <li>Os códigos são salvos na coleção <code>users_codes</code> do Firebase</li>
              <li>Estrutura necessária: <code>code</code> (string) e <code>isUsed</code> (boolean)</li>
              <li>Novos códigos devem ter <code>isUsed: false</code></li>
            </ul>
          </div>

          {showCodes && (
            <div className={styles.codesList}>
              <h6>📋 Códigos Existentes:</h6>
              <Alert variant="info">
                Para ver os códigos existentes, verifique o console do navegador ou a coleção 'users_codes' no Firebase Console.
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CodeManager;
