import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Remove preloader after app mounts
const preloader = document.getElementById('preloader');
if (preloader) {
  preloader.classList.add('hidden');
  setTimeout(() => {
    preloader.remove();
  }, 500); // Wait for transition
}
