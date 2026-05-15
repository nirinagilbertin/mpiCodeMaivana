import { TrashBin, getTrashBinStatus, getTrashBinColor, getTrashBinLabel } from '../../types/resources';
import { Trash2, MapPin, AlertTriangle, Send, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrashBinPopupProps {
  trashBin: TrashBin;
  onReport: (binId: string) => { success: boolean; message: string };
  isReported?: boolean;
}

export default function TrashBinPopup({ trashBin, onReport, isReported = false }: TrashBinPopupProps) {
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const status = getTrashBinStatus(trashBin.reports);
  const color = getTrashBinColor(status);

  const handleReport = () => {
    const result = onReport(trashBin.id);
    setFeedback(result);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-w-[240px]">
      {/* En-tête */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Trash2 size={18} style={{ color }} />
        </div>
        <div>
          <strong className="text-sm text-gray-900">{trashBin.name}</strong>
          <div className="text-xs text-gray-500">{trashBin.address}</div>
        </div>
      </div>

      {/* Statut */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">État :</span>
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {getTrashBinLabel(status)}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(100, (trashBin.reports / 10) * 100)}%`,
              backgroundColor: color 
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            <AlertTriangle size={10} className="inline mr-0.5" />
            {trashBin.reports} signalement{trashBin.reports > 1 ? 's' : ''}
          </span>
          {trashBin.lastCollected && (
            <span className="text-[10px] text-gray-400">
              <Clock size={10} className="inline mr-0.5" />
              Ramassé le {new Date(trashBin.lastCollected).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>

      {/* Bouton signalement */}
      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              feedback.success 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {feedback.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {feedback.message}
          </motion.div>
        ) : isReported ? (
          <motion.div
            key="already-reported"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-xl text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="text-emerald-500" />
            Vous avez déjà signalé ce bac aujourd'hui.
          </motion.div>
        ) : (
          <motion.button
            key="report-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Send size={14} />
            Signaler ce bac
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}