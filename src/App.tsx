import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from './pages/AuthPage/AuthPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AppCheckExample from './components/AppCheckExample';
import { UserData } from './services/authService';
import './App.css';

// Componente para gerenciar o estado do usuário
function AppContent() {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    navigate('/landing');
  };

  const handleRegisterSuccess = (userData: UserData) => {
    setUser(userData);
    // Após o cadastro, o usuário é redirecionado para login
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AuthPage 
            onLogin={() => navigate('/login')}
            onRegister={() => navigate('/register')}
          />
        } 
      />
      <Route 
        path="/login" 
        element={
          <LoginPage 
            onSwitchToRegister={() => navigate('/register')}
            onLoginSuccess={handleLoginSuccess}
          />
        } 
      />
      <Route 
        path="/register" 
        element={
          <RegisterPage 
            onSwitchToLogin={() => navigate('/login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        } 
      />
      <Route 
        path="/landing" 
        element={
          user ? (
            <LandingPage 
              onNavigateToLogin={() => navigate('/login')}
              onNavigateToRegister={() => navigate('/register')}
              onLogout={handleLogout}
              user={user}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/appcheck" 
        element={<AppCheckExample />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
