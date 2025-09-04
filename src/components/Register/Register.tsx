import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import styles from './Register.module.css';
import { validateVerificationCode, CodeValidationResult } from '../../services/verificationCodeService';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string, confirmPassword: string, verificationCode: string) => void;
  onSwitchToLogin: () => void;
  error?: string;
  loading?: boolean;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin, error, loading = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [validated, setValidated] = useState(false);
  const [codeValidation, setCodeValidation] = useState<CodeValidationResult | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  // Validar código em tempo real
  const validateCode = async (code: string) => {
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      setIsValidatingCode(true);
      try {
        const result = await validateVerificationCode(code);
        setCodeValidation(result);
      } catch (error) {
        setCodeValidation({
          isValid: false,
          isUsed: false,
          message: 'Erro ao validar código'
        });
      } finally {
        setIsValidatingCode(false);
      }
    } else {
      setCodeValidation(null);
    }
  };

  // Validar código quando o valor mudar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (verificationCode.length === 6) {
        validateCode(verificationCode);
      } else {
        setCodeValidation(null);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [verificationCode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      if (verificationCode.length !== 6) {
        alert('O código de verificação deve ter 6 dígitos!');
        return;
      }
      if (!codeValidation || !codeValidation.isValid) {
        alert('Por favor, aguarde a validação do código ou insira um código válido!');
        return;
      }
      onRegister(name, email, password, confirmPassword, verificationCode);
    }
    
    setValidated(true);
  };

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard}>
        <Card.Body className={styles.cardBody}>
          <Card.Title className={`text-center mb-4 ${styles.cardTitle}`}>
            <h2>Criar Conta</h2>
          </Card.Title>
          
          {error && (
            <Alert variant="danger" className={`mb-3 ${styles.alert}`}>
              {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className={styles.formLabel}>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, digite seu nome completo (mínimo 2 caracteres).
              </Form.Control.Feedback>
            </Form.Group>

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

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label className={styles.formLabel}>Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, confirme sua senha.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formVerificationCode">
              <Form.Label className={styles.formLabel}>Código de Verificação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o código de 6 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                minLength={6}
                maxLength={6}
                pattern="[0-9]{6}"
                className={`${styles.formControl} ${
                  codeValidation?.isValid ? 'is-valid' : 
                  codeValidation?.isValid === false ? 'is-invalid' : ''
                }`}
                disabled={isValidatingCode}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, digite um código de verificação válido de 6 dígitos.
              </Form.Control.Feedback>
              
              {/* Feedback de validação em tempo real */}
              {isValidatingCode && (
                <div className={`${styles.validationMessage} ${styles.validating}`}>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Validando código...
                </div>
              )}
              
              {codeValidation && !isValidatingCode && (
                <div className={`${styles.validationMessage} ${
                  codeValidation.isValid ? styles.valid : styles.invalid
                }`}>
                  {codeValidation.isValid ? (
                    <span className="me-2">✅</span>
                  ) : (
                    <span className="me-2">❌</span>
                  )}
                  {codeValidation.message}
                </div>
              )}
              
              <Form.Text className="text-muted">
                Digite o código de 6 dígitos que você recebeu por email.
              </Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className={`w-100 mb-3 ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-0">
              Já tem uma conta?{' '}
              <Button 
                variant="link" 
                className={`p-0 text-decoration-none ${styles.btnLink}`}
                onClick={onSwitchToLogin}
              >
                Faça login aqui
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
