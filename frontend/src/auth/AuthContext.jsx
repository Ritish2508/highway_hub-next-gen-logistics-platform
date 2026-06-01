import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (token && userRole) {
      setAuth({
        token,
        role: userRole,
        userId,
        user: null,
      });
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userId", data.userId);

    setAuth({
      token: data.token,
      role: data.role,
      userId: data.userId,
      user: data.user || null,
    });

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    setAuth({
      token: null,
      role: null,
      userId: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};