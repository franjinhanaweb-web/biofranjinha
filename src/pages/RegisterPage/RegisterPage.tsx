import React, { useState } from 'react';
import Register from '../../components/Register/Register';
import { createUser, UserData } from '../../services/authService';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (user: UserData) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
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

      // Criar usuário no Firebase
      const userData = await createUser(email, password, name);
      
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
