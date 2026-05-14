import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useReportsStats } from "../../hooks/useReports";
import { useReports } from "../../hooks/useReports";
import { useCategories } from "../../hooks/useCategories";
import StatsCards from "../../components/dashboard/StatsCards";
import IncidentsChart from "../../components/dashboard/IncidentsChart";
import CategoriesChart from "../../components/dashboard/CategoriesChart";
import CriticalZones from "../../components/dashboard/CriticalZones";
import ReportsTable from "../../components/dashboard/ReportsTable";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useReportsStats();
  const { reports, loading: reportsLoading } = useReports();
  const { changeStatus } = useReports();
  const { categories } = useCategories();

  // 🔥 LOGS pour vérifier les données
  console.log('📊 Dashboard stats:', stats);
  console.log('📋 Dashboard reports:', reports?.length);
  console.log('🏷️ Dashboard categories:', categories);

  // 🔥 Données réelles pour les graphiques
  const chartData = reports?.map(r => ({
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      })
      : "",

    signalements: 1,

    resolus: r.status === "resolved" ? 1 : 0,
  })) || [];

  // 🔥 Catégories avec comptage réel
  const categoriesData = categories.map(cat => {
    const count = reports?.filter(r => {
      const catId = (r as any).category_id || (r as any).categoryId;
      return catId === cat.id;
    }).length || 0;

    return {
      categoryName: cat.name,
      count: count
    };
  }).filter(c => c.count > 0);

  // 🔥 Zones critiques (reports avec urgence "critical" ou "high")
  const criticalZones = Object.values(
    reports?.reduce((acc, report) => {
      // 🔥 Quartier / zone
      const neighborhood =
        (report as any).neighborhood ||
        (report as any).district ||
        "Zone inconnue";

      // 🔥 Initialisation
      if (!acc[neighborhood]) {
        acc[neighborhood] = {
          neighborhood,
          incidentCount: 0,
          trend: "stable" as "up" | "down" | "stable",
          mainCategory: "Inconnue",
          severity: "low" as "high" | "medium" | "low",
        };
      }

      // 🔥 Nombre d'incidents
      acc[neighborhood].incidentCount += 1;

      // 🔥 Catégorie principale
      const categoryName =
        categories.find(
          (c) =>
            c.id ===
            ((report as any).category_id ||
              (report as any).categoryId)
        )?.name || "Inconnue";

      acc[neighborhood].mainCategory = categoryName;

      // 🔥 Gravité
      if (report.urgency === "critical") {
        acc[neighborhood].severity = "high";
      } else if (report.urgency === "high") {
        acc[neighborhood].severity = "medium";
      } else {
        acc[neighborhood].severity = "low";
      }

      // 🔥 Tendance simulée (temporaire)
      // Tu pourras remplacer plus tard par de vraies stats
      const randomTrend = Math.random();

      if (randomTrend > 0.66) {
        acc[neighborhood].trend = "up";
      } else if (randomTrend > 0.33) {
        acc[neighborhood].trend = "stable";
      } else {
        acc[neighborhood].trend = "down";
      }

      return acc;
    }, {} as Record<
      string,
      {
        neighborhood: string;
        incidentCount: number;
        trend: "up" | "down" | "stable";
        mainCategory: string;
        severity: "high" | "medium" | "low";
      }
    >) || {}
  )
    // 🔥 Trier par nombre d'incidents
    .sort((a, b) => b.incidentCount - a.incidentCount)

    // 🔥 Top 5 zones critiques
    .slice(0, 5);

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
            {reportsLoading
              ? 'Chargement...'
              : `${reports?.length || 0} signalements au total`}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentsChart data={chartData} loading={reportsLoading} />
        <CategoriesChart
          data={categoriesData}
          loading={statsLoading}
        />
      </div>

      {/* Zones critiques */}
      <CriticalZones zones={criticalZones} loading={reportsLoading} />

      {/* Tableau des signalements */}
      <ReportsTable
        reports={reports}
        loading={reportsLoading}
        onViewReport={(id) => console.log("Voir le signalement #", id)}
        onStatusChange={async (id, status) => {
          const result = await changeStatus(id, status as any);
          if (result) {
            console.log('✅ Statut mis à jour:', id, status);
          }
        }}
      />
    </div>
  );
}