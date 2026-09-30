import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");
      if (response.data) {
        setUser(response.data);
        connectSocket();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    if (response.data?.user) {
      setUser(response.data.user);
      connectSocket(response.data.accessToken);
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      setUser(null);
      disconnectSocket();
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isOwner: user?.role === "restaurantOwner",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
