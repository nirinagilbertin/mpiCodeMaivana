import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  MapPin,
  Home,
  Map,
  FileText,
  LayoutDashboard,
  Newspaper,
  MessageCircle,
  Layers,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useNotificationContext } from "../../context/NotificationContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuthContext();
  const { unreadCount } = useNotificationContext();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Accueil", icon: Home },
    { to: "/map", label: "Carte", icon: Map },
    { to: "/posts", label: "Actualités", icon: Newspaper },
    { to: "/resources", label: "Ressources", icon: Layers },
    { to: "/chatbot", label: "Assistant", icon: MessageCircle },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/reports", label: "Signalements", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <MapPin size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Fianara Pulse
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Smart City
              </p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
                  ${
                    isActive(link.to)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                {adminLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
                      ${
                        isActive(link.to)
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
                >
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                </motion.span>
              )}
            </Link>

            {/* Profil Desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  {user?.fullName || "Utilisateur"}
                </span>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <User size={16} />
                        Mon profil
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Settings size={16} />
                        Paramètres
                      </Link>
                    </div>
                    <div className="p-1 border-t border-gray-50">
                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-1">
                {/* Profil */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? "Administrateur" : "Citoyen"}
                    </p>
                  </div>
                </div>

                {/* Liens */}
                {[...navLinks, ...(isAdmin ? adminLinks : [])].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                      ${
                        isActive(link.to)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                ))}

                <hr className="my-2" />

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  <User size={18} />
                  Mon profil
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}