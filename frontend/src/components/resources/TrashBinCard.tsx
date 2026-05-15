import { TrashBin, getTrashBinStatus, getTrashBinColor, getTrashBinLabel } from '../../types/resources';
import { Trash2, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrashBinCardProps {
  trashBin: TrashBin;
  onClick?: () => void;
  selected?: boolean;
}

export default function TrashBinCard({ trashBin, onClick, selected = false }: TrashBinCardProps) {
  const status = getTrashBinStatus(trashBin.reports);
  const color = getTrashBinColor(status);
  const label = getTrashBinLabel(status);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      onClick={onClick}
      className={`
        rounded-xl border shadow-sm transition-all cursor-pointer overflow-hidden bg-white
        ${selected ? 'ring-2 ring-orange-400 border-orange-300' : 'border-gray-200 hover:border-orange-200'}
      `}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${color}20` }}>
            <Trash2 size={18} style={{ color }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 truncate">{trashBin.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{trashBin.address}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <AlertTriangle size={10} />
                {trashBin.reports} signalement{trashBin.reports > 1 ? 's' : ''}
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}