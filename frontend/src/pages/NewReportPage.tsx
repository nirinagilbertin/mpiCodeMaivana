import { motion } from "framer-motion";
import ReportForm from "../components/reports/ReportForm";

export default function NewReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ReportForm />
        </motion.div>
      </div>
    </div>
  );
}