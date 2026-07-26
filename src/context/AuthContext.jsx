"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe, logoutUser } from "@/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-verify JWT session on load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await getMe();
        if (res && (res.user || res.data)) {
          setUser(res.user || res.data);
        } else {
          setUser(res);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
