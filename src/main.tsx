import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import KasbonKuLanding from './KasbonKuLanding';
import Login from './auth/Login';
import './style.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login'>('landing');

  if (currentPage === 'login') {
    return (
      <Login 
        onBackToHome={() => setCurrentPage('landing')} 
        onNavigateToRegister={() => alert('Pendaftaran akun warung baru segera hadir!')}
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