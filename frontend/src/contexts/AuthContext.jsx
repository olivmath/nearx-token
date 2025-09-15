import React, { createContext, useContext, useState, useEffect } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simular opções de registro para WebAuthn
  const generateRegistrationOptions = () => {
    return {
      rp: {
        name: 'Blockchain Quiz App',
        id: 'localhost',
      },
      user: {
        id: new TextEncoder().encode(Math.random().toString()),
        name: `user_${Date.now()}@example.com`,
        displayName: `User ${Date.now()}`,
      },
      challenge: new Uint8Array(32).map(() => Math.floor(Math.random() * 256)),
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      timeout: 60000,
      attestation: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
    };
  };

  // Simular opções de autenticação para WebAuthn
  const generateAuthenticationOptions = () => {
    return {
      challenge: new Uint8Array(32).map(() => Math.floor(Math.random() * 256)),
      timeout: 60000,
      userVerification: 'required',
    };
  };

  const register = async (username) => {
    setIsLoading(true);
    try {
      const options = generateRegistrationOptions();
      options.user.name = username;
      options.user.displayName = username;
      
      const attResp = await startRegistration(options);
      
      // Simular salvamento no localStorage
      const userData = {
        id: username,
        name: username,
        credential: attResp,
        registeredAt: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    try {
      const options = generateAuthenticationOptions();
      const authResp = await startAuthentication(options);
      
      // Simular verificação - em produção, isso seria feito no servidor
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Usuário não encontrado' };
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar se há usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};