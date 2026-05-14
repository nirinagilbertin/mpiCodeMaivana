import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useReports } from "../../hooks/useReports";
import ReportsTable from "../../components/dashboard/ReportsTable";
import { useNavigate } from "react-router-dom";

export default function ReportsManagerPage() {
  const { reports, loading, changeStatus } = useReports();
  const navigate = useNavigate();

  const handleViewReport = (id: number) => {
    navigate(`/reports/${id}`);
  };

  const handleStatusChange = async (id: number, status: string) => {
    await changeStatus(id, status as any);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <FileText size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Gestion des signalements
          </h1>
          <p className="text-sm text-gray-500">
            {reports.length} signalement{reports.length > 1 ? "s" : ""} au total
          </p>
        </div>
      </motion.div>

      <ReportsTable
        reports={reports}
        loading={loading}
        onViewReport={handleViewReport}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}