import { Pharmacy } from '../../types/resources';
import { Pill, MapPin, Phone, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isAdmin?: boolean;
  onToggleDuty?: (pharmacyId: string) => void;
  onClick?: () => void;
  selected?: boolean;
}

export default function PharmacyCard({ pharmacy, isAdmin = false, onToggleDuty, onClick, selected = false }: PharmacyCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      onClick={onClick}
      className={`
        rounded-xl border shadow-sm transition-all cursor-pointer overflow-hidden
        ${selected ? 'ring-2 ring-emerald-400 border-emerald-300' : ''}
        ${pharmacy.isOnDuty 
          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300' 
          : 'bg-white border-gray-200 hover:border-amber-300'
        }
      `}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${pharmacy.isOnDuty ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <Pill size={18} className={pharmacy.isOnDuty ? 'text-emerald-600' : 'text-amber-600'} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm text-gray-900 truncate">{pharmacy.name}</h3>
              {isAdmin && onToggleDuty && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleDuty(pharmacy.id); }}
                  className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {pharmacy.isOnDuty ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Phone size={10} />{pharmacy.phone}
              </span>
              {pharmacy.isOnDuty && pharmacy.dutyEnd && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Clock size={10} />
                  Jusqu'à {new Date(pharmacy.dutyEnd).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>

          <span className={`
            shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${pharmacy.isOnDuty ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'}
          `}>
            {pharmacy.isOnDuty ? 'Garde' : 'Fermé'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}