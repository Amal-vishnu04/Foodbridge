import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000',
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fw_token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/api/auth/login', { email, password });
    localStorage.setItem('fw_token', data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    const userData = data.user || data;
    setUser(userData);
    return userData;
  };

  const register = async (form) => {
    const { data } = await API.post('/api/auth/register', form);
    localStorage.setItem('fw_token', data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    const userData = data.user || data;
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('fw_token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);