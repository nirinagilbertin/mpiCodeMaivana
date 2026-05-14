import { Link } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">Fianara Pulse</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Plateforme citoyenne intelligente pour la ville de Fianarantsoa.
              Ensemble, construisons une Smart City.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/map"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Carte interactive
                </Link>
              </li>
              <li>
                <Link
                  to="/new-report"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Signaler un problème
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>contact@fianarapulse.mg</li>
              <li>+261 34 00 000 00</li>
              <li>Fianarantsoa, Madagascar</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Fianara Pulse. Tous droits
            réservés.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Fait avec <Heart size={14} className="text-red-500 fill-red-500" />{" "}
            pour Fianarantsoa
          </p>
        </div>
      </div>
    </footer>
  );
}