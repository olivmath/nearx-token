import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { register, login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() && !isLogin) {
      setError('Por favor, insira um nome de usuário');
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login();
      } else {
        result = await register(username);
      }

      if (!result.success) {
        setError(result.error || 'Erro na autenticação');
      }
    } catch (err) {
      setError('Erro inesperado. Verifique se seu dispositivo suporta Passkey.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Blockchain Quiz</h1>
          <p>Autenticação segura com Passkey</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome de usuário"
                required={!isLogin}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading">⏳ Processando...</span>
            ) : (
              <span>
                🔑 {isLogin ? 'Entrar com Passkey' : 'Registrar com Passkey'}
              </span>
            )}
          </button>
        </form>

        <div className="auth-info">
          <div className="info-item">
            <span className="icon">🛡️</span>
            <span>Autenticação biométrica segura</span>
          </div>
          <div className="info-item">
            <span className="icon">🚀</span>
            <span>Sem senhas para lembrar</span>
          </div>
          <div className="info-item">
            <span className="icon">⚡</span>
            <span>Login rápido e conveniente</span>
          </div>
        </div>

        <div className="stellar-link">
          <p>Explore o universo blockchain:</p>
          <a
            href="https://stellarexplorer.io"
            target="_blank"
            rel="noopener noreferrer"
            className="stellar-button"
          >
            🌟 Stellar Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;