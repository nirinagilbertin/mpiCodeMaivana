import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'app_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : restaure l'utilisateur depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login : cherche l'utilisateur directement dans la table users
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // ⚠️ nécessite une colonne password dans ta table
      .limit(1);

    if (error) throw new Error('Erreur de connexion');
    if (!data || data.length === 0) throw new Error('Email ou mot de passe incorrect');

    const d = data[0];
    const mappedUser: User = {
      id: d.id,
      email: d.email,
      fullName: d.full_name,
      role: d.role,
      isActive: d.is_active,
      avatarUrl: d.avatar_url,
      neighborhood: d.neighborhood,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password, full_name: fullName, role: 'citizen', is_active: true })
      .select()
      .single();

    if (error) throw new Error('Erreur lors de l\'inscription');

    const mappedUser: User = {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    return Promise.resolve();
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}

export { useAuth as useAuthContext };