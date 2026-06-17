import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  );

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const esAdmin = () => usuario?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
