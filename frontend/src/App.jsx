import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Quiz from './components/Quiz';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user ? <Quiz /> : <Auth />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
