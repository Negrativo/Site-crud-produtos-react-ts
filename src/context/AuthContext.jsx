import { createContext, useState, useEffect } from 'react';
import api from '../server/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('token: ', token);
      if (token) {
        setIsLoading(true);
        try {
          const response = await api.get('/me');
          setIsAuthenticated(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Erro ao validar token:', error);
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsLoading(false)
        }
      }
    };

    checkAuth();
  }, []);

  const login = (token) => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/atualiza-etiq/login';
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, setIsLoading }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
