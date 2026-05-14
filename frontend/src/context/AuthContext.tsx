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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // 🔥 1. Vérifier la session existante (persiste après refresh)
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user?.email) {
      fetchUserByEmail(session.user.email);
    } else {
      setLoading(false);
    }
  });

  // 🔥 2. Écouter les changements d'auth (login/logout)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session?.user?.email) {
        fetchUserByEmail(session.user.email);
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);

  async function fetchUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!error && data) {
      setUser({
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        isActive: data.is_active,
        avatarUrl: data.avatar_url,
        neighborhood: data.neighborhood,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });
    }
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchUserByEmail(email);
  }

  async function signUp(email: string, password: string, fullName: string) {
    // 1. Créer dans auth.users (Supabase)
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // 2. Créer dans notre table users
    await supabase.from('users').insert({
      email,
      full_name: fullName,
      role: 'citizen',
      is_active: true
    });

    await fetchUserByEmail(email);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}

// Alias pour compatibilité avec le reste du projet
export { useAuth as useAuthContext };