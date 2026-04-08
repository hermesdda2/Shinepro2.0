import { createContext, useContext, useState, useCallback } from 'react';
import { API_URL as API } from './config';
const TOKEN_KEY = 'shinepro_admin_token';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) { localStorage.removeItem(TOKEN_KEY); return null; }
      return payload;
    } catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setAdmin({ email: data.email, role: data.role });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  const isAuthenticated = !!token && !!admin;

  return (
    <AdminAuthContext.Provider value={{ token, admin, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
