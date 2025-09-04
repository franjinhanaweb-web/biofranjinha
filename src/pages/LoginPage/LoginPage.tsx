import React, { useState } from 'react';
import Login from '../../components/Login/Login';
import { signInUser, UserData } from '../../services/authService';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: UserData) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      setLoading(true);
      
      // Fazer login no Firebase
      const userData = await signInUser(email, password);
      onLoginSuccess(userData);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={onSwitchToRegister}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default LoginPage;
