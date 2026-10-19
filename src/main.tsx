import React from 'react';
import ReactDOM from 'react-dom/client';
import KasbonKuLanding from './KasbonKuLanding';
// @ts-ignore CSS files are loaded by the bundler.
import './style.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <KasbonKuLanding />
  </React.StrictMode>
);