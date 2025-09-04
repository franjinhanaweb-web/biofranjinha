import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  error?: string;
  loading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, error, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      onLogin(email, password);
    }
    
    setValidated(true);
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Card.Body className={styles.cardBody}>
          <Card.Title className={`text-center mb-4 ${styles.cardTitle}`}>
            <h2>Entrar</h2>
          </Card.Title>
          
          {error && (
            <Alert variant="danger" className={`mb-3 ${styles.alert}`}>
              {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className={styles.formLabel}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, digite um email válido.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className={styles.formLabel}>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                A senha deve ter pelo menos 6 caracteres.
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className={`w-100 mb-3 ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-0">
              Não tem uma conta?{' '}
              <Button 
                variant="link" 
                className={`p-0 text-decoration-none ${styles.btnLink}`}
                onClick={onSwitchToRegister}
              >
                Cadastre-se aqui
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
