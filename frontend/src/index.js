import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MoviesContextProvider } from './context/MovieContext'
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MoviesContextProvider>
        <App />
      </MoviesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);