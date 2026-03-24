import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// Using a standard public dummy client ID or expect it from env
// Note: For a real app, this should be in .env.local as VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "560778091728-a5kaotdo64koqp99s3j647nl5a1d70fh.apps.googleusercontent.com"; // Provide a valid looking mock/test ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
