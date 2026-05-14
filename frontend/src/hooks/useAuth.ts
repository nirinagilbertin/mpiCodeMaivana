import { useState, useEffect, useCallback } from "react";
import type { User } from "../types/user";
import { getCurrentUser, login, register, logout } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    // Essaye de récupérer l'utilisateur courant
    getCurrentUser()
      .then((u) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {
        // Pas connecté, c'est normal
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);
      setLoading(true);
      try {
        const { user: u } = await login(email, password);
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        return true;
      } catch (err) {
        setError("Email ou mot de passe incorrect");
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (data: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      neighborhood?: string;
    }): Promise<boolean> => {
      setError(null);
      setLoading(true);
      try {
        const { user: u } = await register(data);
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        return true;
      } catch (err) {
        setError("Erreur lors de l'inscription");
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}