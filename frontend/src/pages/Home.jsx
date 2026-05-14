import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, FileText, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    { icon: Map, title: 'Carte intelligente', desc: 'Visualisez tous les incidents en temps réel.' },
    { icon: FileText, title: 'Signalements citoyens', desc: 'Signalez un problème avec photo et géolocalisation.' },
    { icon: AlertTriangle, title: 'Alertes en temps réel', desc: 'Soyez informé des urgences près de chez vous.' },
    { icon: TrendingUp, title: 'Suivi des interventions', desc: 'Suivez l’évolution de vos signalements.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-linear-to-r from-primary to-primary-dark text-white rounded-2xl p-8 mb-10">
        <h1 className="text-3xl font-bold mb-2">Fianara Connect</h1>
        <p className="text-gray-200 mb-6">Plateforme citoyenne intelligente pour Fianarantsoa</p>
        {!isAuthenticated ? (
          <div className="flex gap-3">
            <Link to="/register" className="bg-white text-primary px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-100">Rejoindre</Link>
            <Link to="/login" className="border border-white text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-white/10">Se connecter</Link>
          </div>
        ) : (
          <p className="bg-white/20 inline-block px-4 py-2 rounded-full text-sm">Bienvenue, {user?.fullName} !</p>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <feat.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-gray-900">{feat.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
        <h3 className="text-lg font-semibold">Prêt à contribuer ?</h3>
        <p className="text-gray-500 text-sm mt-1">Signalez un problème ou partagez une information utile.</p>
        {!isAuthenticated && (
          <Link to="/register" className="inline-flex items-center gap-1 mt-3 text-primary font-medium text-sm hover:underline">
            Créer mon compte <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;