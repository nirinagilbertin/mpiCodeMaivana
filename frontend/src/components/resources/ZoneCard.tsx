import { ResourceZone } from '../../types/resources';
import { getZoneStatus } from '../../mocks/resources';
import { Droplets, Zap, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZoneCardProps {
  zone: ResourceZone;
}

const statusConfig = {
  critical: {
    bg: 'bg-red-50 border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    badge: 'bg-red-500',
    label: 'Critique',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    badge: 'bg-amber-500',
    label: 'Alerte',
  },
  normal: {
    bg: 'bg-white border-gray-200',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    badge: 'bg-emerald-500',
    label: 'Normal',
  },
};

export default function ZoneCard({ zone }: ZoneCardProps) {
  const status = getZoneStatus(zone);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${config.bg} rounded-xl p-4 border shadow-sm transition-all cursor-pointer group`}
    >
      <div className="flex items-center gap-3">
        {/* Icône ressource */}
        <div className={`p-2 rounded-lg ${
          zone.type === 'water' ? 'bg-blue-100' : 'bg-amber-100'
        }`}>
          {zone.type === 'water' ? (
            <Droplets size={18} className="text-blue-600" />
          ) : (
            <Zap size={18} className="text-amber-600" />
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-gray-900 truncate">{zone.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${zone.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  zone.level < 30 ? 'bg-red-500' :
                  zone.level < 55 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-gray-600 w-9 text-right">
              {zone.level}%
            </span>
          </div>
        </div>

        {/* Statut */}
        <StatusIcon size={16} className={config.iconColor} />
      </div>
    </motion.div>
  );
}