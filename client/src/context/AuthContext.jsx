import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from local storage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('crimenova_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('crimenova_user');
      }
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('crimenova_user', JSON.stringify(userData));
    if (token) localStorage.setItem('crimenova_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crimenova_user');
    localStorage.removeItem('crimenova_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
