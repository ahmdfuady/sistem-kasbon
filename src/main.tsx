import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import KasbonKuLanding from './KasbonKuLanding';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import './style.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'forgot-password'>('landing');

  if (currentPage === 'login') {
    return (
      <Login 
        onBackToHome={() => setCurrentPage('landing')} 
        onNavigateToRegister={() => setCurrentPage('register')}
        onForgotPassword={() => setCurrentPage('forgot-password')}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <Register 
        onBackToLogin={() => setCurrentPage('login')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <ForgotPassword 
        onBackToLogin={() => setCurrentPage('login')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  return (
    <KasbonKuLanding onStartFree={() => setCurrentPage('login')} />
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);