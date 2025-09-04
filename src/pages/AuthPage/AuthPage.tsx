import React from 'react';
import AuthHero from '../../components/AuthHero/AuthHero';

interface AuthPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const heroProps = {
    title: 'Um encontro que vai além do óbvio',
    subtitle: 'Carinho sem pressa, ambiente sofisticado e momentos feitos para despertar o melhor de você.',
    accentWord: 'encontro',
    tagText: 'Hey Você!',
    imageSrc: '/images/hero-photo1.jpg',
    imageAlt: 'Mulher elegante em pose profissional'
  };

  return (
    <div className="auth-page">
      <AuthHero 
        {...heroProps}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  );
};

export default AuthPage;
