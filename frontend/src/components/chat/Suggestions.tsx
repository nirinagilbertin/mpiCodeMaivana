import { Store, Droplets, Car, AlertTriangle, CloudRain } from "lucide-react";

const SUGGESTIONS = [
  { id: "1", icon: Store, text: "Quel marché est le moins saturé ?" },
  { id: "2", icon: Droplets, text: "Pourquoi une coupure d'eau ?" },
  { id: "3", icon: Car, text: "Quel itinéraire éviter ?" },
  { id: "4", icon: AlertTriangle, text: "Quelle zone éviter ce soir ?" },
  { id: "5", icon: CloudRain, text: "Risque d'inondation ?" },
];

interface SuggestionsProps {
  onSelect: (text: string) => void;
}

export default function Suggestions({ onSelect }: SuggestionsProps) {
  return (
    <div className="w-full px-4 py-3">
      <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.text)}
              className="
                group flex items-center gap-2
                rounded-full
                border border-blue-100
                bg-white
                px-4 py-2
                text-sm text-slate-700
                shadow-sm
                transition-all
                hover:border-blue-300
                hover:bg-blue-50
                hover:text-blue-700
                active:scale-95
              "
            >
              <Icon
                size={16}
                className="text-blue-500 transition-colors group-hover:text-blue-600"
              />
              <span className="whitespace-nowrap">{s.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}