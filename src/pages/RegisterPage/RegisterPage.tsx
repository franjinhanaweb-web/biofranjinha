import React, { useState } from 'react';
import Register from '../../components/Register/Register';
import { createUser, UserData } from '../../services/authService';
import { validateVerificationCode, markCodeAsUsed } from '../../services/verificationCodeService';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (user: UserData) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string, verificationCode: string) => {
    try {
      setError('');
      setLoading(true);
      
      // Validações básicas
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      if (name.length < 2) {
        setError('O nome deve ter pelo menos 2 caracteres.');
        setLoading(false);
        return;
      }

      // Validar formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (verificationCode.length !== 36 || !uuidRegex.test(verificationCode)) {
        setError('O código de verificação deve ter formato UUID válido (36 caracteres).');
        setLoading(false);
        return;
      }

      // Validar código de verificação
      const codeValidation = await validateVerificationCode(verificationCode);
      if (!codeValidation.isValid) {
        setError(codeValidation.message);
        setLoading(false);
        return;
      }

      if (!codeValidation.codeData) {
        setError('Erro ao validar código de verificação.');
        setLoading(false);
        return;
      }

      // Criar usuário no Firebase
      const userData = await createUser(email, password, name, verificationCode);
      
      // Marcar código como usado
      await markCodeAsUsed(codeValidation.codeData.id, userData.uid);
      
      // Sucesso no cadastro
      alert('Conta criada com sucesso! Você pode fazer login agora.');
      onRegisterSuccess(userData);
      onSwitchToLogin(); // Redirecionar para login após cadastro
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-page">
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={onSwitchToLogin}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default RegisterPage;
