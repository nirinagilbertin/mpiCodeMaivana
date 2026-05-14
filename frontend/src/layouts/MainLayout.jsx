import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Map, 
  FileText, 
  Bell, 
  MessageCircle, 
  User, 
  LogOut,
  LayoutDashboard,
  Search,
  PlusCircle,
  Settings,
  HelpCircle,
  UserPlus,
  MapPin,
  Briefcase,
  AlertTriangle,
  Users,
  ShieldCheck
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/map', label: 'Carte', icon: Map },
    { path: '/feed', label: 'Fil d’actu', icon: FileText },
    { path: '/reports', label: 'Signalements', icon: MapPin },
  ];

  // Liens admin (uniquement si l'utilisateur a le rôle admin)
  const adminLinks = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/dashboard/reports', label: 'Modérer signalements', icon: AlertTriangle },
    { path: '/dashboard/posts', label: 'Modérer publications', icon: FileText },
    { path: '/dashboard/users', label: 'Gérer utilisateurs', icon: Users },
    { path: '/dashboard/critical-zones', label: 'Zones critiques', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* ========== SIDEBAR GAUCHE ========== */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-primary">
            Fianara Connect
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Navigation principale */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-100 text-primary'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}

          {/* Liens supplémentaires (Marketplace, Groupes) – optionnels */}
          <Link
            to="/marketplace"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <Briefcase size={18} />
            Marketplace
          </Link>
          <Link
            to="/groups"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <UserPlus size={18} />
            Groupes
          </Link>

          {/* === SECTION ADMIN (visible uniquement pour les admins) === */}
          {isAdmin && (
            <>
              <div className="pt-4 mt-2 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
              </div>
              {adminLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-100 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Bouton "Poster" */}
        <div className="px-3 py-4">
          <button
            onClick={() => navigate('/create-report')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary-dark transition"
          >
            <PlusCircle size={18} />
            Nouvelle publication
          </button>
        </div>

        {/* Footer sidebar */}
        <div className="border-t border-gray-200 px-3 py-4 space-y-1">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Settings size={18} />
            Paramètres
          </Link>
          <Link to="/help" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <HelpCircle size={18} />
            Aide
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ========== SECTION PRINCIPALE ========== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation (barre de recherche + icônes) – inchangée */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un électricien, un plombier, une annonce..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-600 hover:text-primary">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="text-gray-600 hover:text-primary">
                <MessageCircle size={20} />
              </button>
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-gray-500" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {user?.fullName?.split(' ')[0]}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar droite – inchangée */}
      <aside className="w-80 bg-white border-l border-gray-200 shrink-0 hidden lg:flex flex-col p-5 space-y-6">
        {/* Widgets (localisation, promo, progression) – déjà codés */}
      </aside>

      {/* Chat widget – inchangé */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default MainLayout;