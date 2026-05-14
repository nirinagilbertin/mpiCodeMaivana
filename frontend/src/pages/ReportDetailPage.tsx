import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useReportById } from "../hooks/useReports";
import ReportDetail from "../components/reports/ReportDetail";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { report, loading, error } = useReportById(id ? Number(id) : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmptyState
          title="Signalement introuvable"
          description="Ce signalement n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ReportDetail report={report} />
        </motion.div>
      </div>
    </div>
  );
}