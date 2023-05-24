import React, { createContext, useState } from 'react';
import AuthService from '../utils/auth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.loggedIn());

  const login = (idToken) => {
    AuthService.login(idToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
