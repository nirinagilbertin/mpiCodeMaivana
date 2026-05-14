import { MapPin, AlertTriangle, TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";

interface CriticalZone {
  neighborhood: string;
  incidentCount: number;
  trend: "up" | "down" | "stable";
  mainCategory: string;
  severity: "high" | "medium" | "low";
}

interface CriticalZonesProps {
  zones: CriticalZone[];
  loading?: boolean;
}

const mockZones: CriticalZone[] = [
  {
    neighborhood: "Tanambao",
    incidentCount: 8,
    trend: "up",
    mainCategory: "Eau et assainissement",
    severity: "high",
  },
  {
    neighborhood: "Anjoma",
    incidentCount: 5,
    trend: "stable",
    mainCategory: "Transport",
    severity: "medium",
  },
  {
    neighborhood: "Ambalapaiso",
    incidentCount: 4,
    trend: "down",
    mainCategory: "Routes",
    severity: "medium",
  },
  {
    neighborhood: "Antsenakely",
    incidentCount: 3,
    trend: "up",
    mainCategory: "Sécurité",
    severity: "high",
  },
];

const severityConfig = {
  high: { color: "#EF4444", label: "Critique" },
  medium: { color: "#F59E0B", label: "Modéré" },
  low: { color: "#10B981", label: "Faible" },
};

const trendConfig = {
  up: { color: "#EF4444", icon: "↑", label: "En hausse" },
  down: { color: "#10B981", icon: "↓", label: "En baisse" },
  stable: { color: "#6B7280", icon: "→", label: "Stable" },
};

export default function CriticalZones({
  zones,
  loading = false,
}: CriticalZonesProps) {
  const displayZones = zones.length > 0 ? zones : mockZones;

  if (loading) {
    return (
      <Card padding="lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Zones critiques
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Zones critiques
      </h3>

      {displayZones.length === 0 ? (
        <EmptyState
          title="Aucune zone critique"
          description="Tous les quartiers sont stables pour le moment."
        />
      ) : (
        <div className="space-y-3">
          {displayZones.map((zone) => (
            <div
              key={zone.neighborhood}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {zone.neighborhood}
                  </p>
                  <p className="text-xs text-gray-500">
                    {zone.mainCategory}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {zone.incidentCount}
                  </p>
                  <p className="text-xs text-gray-500">incidents</p>
                </div>

                <Badge
                  color={severityConfig[zone.severity].color}
                  size="sm"
                >
                  <AlertTriangle size={10} />
                  {severityConfig[zone.severity].label}
                </Badge>

                <span
                  className="text-xs font-medium"
                  style={{ color: trendConfig[zone.trend].color }}
                >
                  {trendConfig[zone.trend].icon}{" "}
                  {trendConfig[zone.trend].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}