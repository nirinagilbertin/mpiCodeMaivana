import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useReportsStats } from "../../hooks/useReports";
import { useReports } from "../../hooks/useReports";
import StatsCards from "../../components/dashboard/StatsCards";
import IncidentsChart from "../../components/dashboard/IncidentsChart";
import CategoriesChart from "../../components/dashboard/CategoriesChart";
import CriticalZones from "../../components/dashboard/CriticalZones";
import ReportsTable from "../../components/dashboard/ReportsTable";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useReportsStats();
  const { reports, loading: reportsLoading } = useReports();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <LayoutDashboard size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Vue d'ensemble de la situation urbaine
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentsChart data={[]} loading={statsLoading} />
        <CategoriesChart
          data={
            stats?.byCategory.map((c) => ({
              categoryName: c.categoryName,
              count: c.count,
            })) || []
          }
          loading={statsLoading}
        />
      </div>

      {/* Zones critiques */}
      <CriticalZones zones={[]} loading={statsLoading} />

      {/* Tableau des signalements */}
      <ReportsTable
        reports={reports}
        loading={reportsLoading}
        onViewReport={(id) => console.log("Voir", id)}
        onStatusChange={(id, status) => console.log("Changer statut", id, status)}
      />
    </div>
  );
}