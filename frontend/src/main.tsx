import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            style: { 
              background: '#111c30', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.1)' 
            } 
          }} 
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
