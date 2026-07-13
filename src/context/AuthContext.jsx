import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as apiLogin, register as apiRegister, fetchMe } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("payflow_access");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await fetchMe();
      setUser(data);
    } catch {
      localStorage.removeItem("payflow_access");
      localStorage.removeItem("payflow_refresh");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (username, password) => {
    const { data } = await apiLogin(username, password);
    localStorage.setItem("payflow_access", data.access);
    localStorage.setItem("payflow_refresh", data.refresh);
    await loadUser();
  };

  const register = async (payload) => {
    await apiRegister(payload);
    await login(payload.username, payload.password);
  };

  const logout = () => {
    localStorage.removeItem("payflow_access");
    localStorage.removeItem("payflow_refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: loadUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}