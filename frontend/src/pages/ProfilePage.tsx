import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Edit,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const { user, isAdmin } = useAuthContext();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card padding="lg" className="text-center max-w-md">
          <User size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Non connecté
          </h2>
          <p className="text-sm text-gray-500">
            Connectez-vous pour accéder à votre profil.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* En-tête profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                {user.fullName?.charAt(0) || "?"}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.fullName}
                  </h1>
                  {isAdmin && (
                    <Badge color="#8B5CF6" size="sm">
                      <Shield size={10} />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-gray-600">
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400" />
                      {user.phone}
                    </div>
                  )}
                  {user.neighborhood && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {user.neighborhood}
                    </div>
                  )}
                  {user.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      Membre depuis {formatDate(user.createdAt)}
                    </div>
                  )}
                </div>
              </div>

              <Button variant="secondary" size="sm" icon={<Edit size={14} />}>
                Modifier
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Activité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mon activité
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Signalements", value: 5, color: "#3B82F6" },
                { label: "Commentaires", value: 12, color: "#8B5CF6" },
                { label: "Likes reçus", value: 28, color: "#EF4444" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: stat.color + "08" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}