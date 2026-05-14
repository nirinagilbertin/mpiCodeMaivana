import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Info } from "lucide-react";
import MapView from "../components/map/MapView";
import { useSocketContext } from "../context/SocketContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { formatRelativeTime } from "../utils/formatDate";

export default function MapPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { newReports } = useSocketContext();

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
                Visualisez les incidents en temps réel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

      {/* Signalements temps réel */}
      {newReports.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Derniers signalements en temps réel
            </h2>
            <div className="space-y-2">
              {newReports.slice(0, 3).map((report) => (
                <Card key={report.id} padding="sm" className="flex items-center gap-3">
                  <AlertTriangle
                    size={16}
                    className="text-red-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(report.createdAt)}
                    </p>
                  </div>
                  <Badge color="#EF4444" size="sm">
                    Nouveau
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