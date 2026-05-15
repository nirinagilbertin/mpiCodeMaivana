import { Play, Pause } from 'lucide-react';

interface SimulationControlsProps {
  running: boolean;
  onToggle: () => void;
  lastUpdate: number;
}

export default function SimulationControls({ running, onToggle, lastUpdate }: SimulationControlsProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition"
        title={running ? 'Pause' : 'Démarrer'}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <span>Dernière mise à jour : {new Date(lastUpdate).toLocaleTimeString()}</span>
    </div>
  );
}