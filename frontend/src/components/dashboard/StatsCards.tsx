import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  } | null;
  loading: boolean;
}

const statItems = [
  {
    key: "total",
    label: "Total signalements",
    icon: ClipboardList,
    color: "#3B82F6",
    bgColor: "bg-blue-50",
  },
  {
    key: "pending",
    label: "En attente",
    icon: Clock,
    color: "#F59E0B",
    bgColor: "bg-yellow-50",
  },
  {
    key: "inProgress",
    label: "En cours",
    icon: AlertTriangle,
    color: "#8B5CF6",
    bgColor: "bg-purple-50",
  },
  {
    key: "resolved",
    label: "Résolus",
    icon: CheckCircle,
    color: "#10B981",
    bgColor: "bg-green-50",
  },
];

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} padding="lg">
            <div className="animate-pulse space-y-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-12 bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const value = stats[item.key as keyof typeof stats];
        const Icon = item.icon;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card padding="lg" hover>
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <TrendingUp size={16} className="text-gray-300" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.label}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}