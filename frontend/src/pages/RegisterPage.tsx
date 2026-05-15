import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Création user avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'citizen',
          },
        },
      });

      if (error) throw error;

      // Le trigger va automatiquement créer l'entrée dans la table users
      // Pas besoin d'insertion manuelle !

      setSuccess("Compte créé avec succès 🎉");

      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card padding="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-green-600" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">
              Inscription
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Créer un compte Fianara Pulse
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nom complet"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rakoto Jean"
              icon={<User size={18} />}
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}