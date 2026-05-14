import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 AJOUTÉ
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, PlusCircle } from "lucide-react"; // 🔥 PlusCircle ajouté
import MapView from "../components/map/MapView";
import { useSocketContext } from "../context/SocketContext";
import { useReports } from "../hooks/useReports";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { formatRelativeTime } from "../utils/formatDate";

export default function MapPage() {
  const navigate = useNavigate(); // 🔥 AJOUTÉ
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { newReports } = useSocketContext();
  const { reports, loading } = useReports();

  console.log('🗺️ Reports Supabase:', reports?.length, reports);

  const allReports = [...(reports || []), ...(newReports || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Carte interactive
              </h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Chargement...' : `${reports?.length || 0} incidents signalés`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🔥 BOUTON SIGNALER */}
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle size={16} />}
              onClick={() => navigate('/new-report')}
            >
              Signaler un incident
            </Button>

            <Button
              variant={showHeatmap ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              {showHeatmap ? "Cacher heatmap" : "Voir heatmap"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Carte */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MapView showHeatmap={showHeatmap} />
        </motion.div>
      </div>

      {/* Signalements récents */}
      {allReports.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Derniers signalements
            </h2>
            <div className="space-y-2">
              {allReports.slice(0, 5).map((report: any) => (
                <Card key={report.id} padding="sm" className="flex items-center gap-3">
                  <AlertTriangle
                    size={16}
                    className={report.urgency === 'critical' ? 'text-red-500' : 'text-orange-500'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.created_at || report.createdAt 
                        ? formatRelativeTime(report.created_at || report.createdAt)
                        : 'À l\'instant'}
                    </p>
                  </div>
                  <Badge color={report.urgency === 'critical' ? '#EF4444' : '#F59E0B'} size="sm">
                    {report.urgency || 'medium'}
                  </Badge>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}