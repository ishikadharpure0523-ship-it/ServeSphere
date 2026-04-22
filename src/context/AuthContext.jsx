import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('servesphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [role, setRole] = useState(() => {
    return localStorage.getItem('servesphere_role') || null;
  });

  // Persist to localStorage whenever user or role changes
  useEffect(() => {
    if (user && role) {
      localStorage.setItem('servesphere_user', JSON.stringify(user));
      localStorage.setItem('servesphere_role', role);
    } else {
      localStorage.removeItem('servesphere_user');
      localStorage.removeItem('servesphere_role');
    }
  }, [user, role]);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('servesphere_user');
    localStorage.removeItem('servesphere_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
