import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (via cookie session)
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/profile");
        setUser(response.data.data);
      } catch (err) {
        setUser(null);
        setError(err.response?.data?.message || "Erreur de connexion");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      setUser(response.data.data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Échec de la connexion";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/users/logout");
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Échec de la déconnexion";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post("/users/register", userData);
      setUser(response.data.data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Échec de l'inscription";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: err.response?.data?.errors,
      };
    } finally {
      setLoading(false);
    }
  };
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put("/users/profile", profileData);
      setUser(response.data.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Échec de la mise à jour";
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await api.put("/users/password", {
        oldPassword,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Échec du changement de mot de passe";
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    checkAuth,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
