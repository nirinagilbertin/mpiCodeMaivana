import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    neighborhood: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-sm text-gray-500">
            ou{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              connectez-vous
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary"
                placeholder="Jean Rasoa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary"
                placeholder="jean@exemple.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe (min. 6) *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary"
                placeholder="••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary"
                placeholder="+261 XX XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quartier (optionnel)</label>
            <input
              name="neighborhood"
              type="text"
              value={formData.neighborhood}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary"
              placeholder="Ex: Tanambao"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-primary text-white rounded-xl py-2.5 font-semibold hover:bg-primary-dark transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
            <UserPlus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;