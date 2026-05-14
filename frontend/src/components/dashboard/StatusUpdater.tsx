import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStatusLabel, getStatusColor } from "../../utils/getStatusColor";
import { REPORT_STATUS } from "../../config/constants";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";

interface StatusUpdaterProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  loading?: boolean;
}

export default function StatusUpdater({
  currentStatus,
  onStatusChange,
  loading = false,
}: StatusUpdaterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  const handleStatusSelect = (status: string) => {
    if (status === "rejected") {
      setConfirmStatus(status);
    } else {
      onStatusChange(status);
      setIsOpen(false);
    }
  };

  const handleConfirmReject = () => {
    if (confirmStatus) {
      onStatusChange(confirmStatus);
      setConfirmStatus(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<ChevronDown size={14} />}
        disabled={loading}
        style={{
          borderColor: getStatusColor(currentStatus),
          color: getStatusColor(currentStatus),
        }}
      >
        {getStatusLabel(currentStatus)}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-30"
          >
            {Object.entries(REPORT_STATUS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleStatusSelect(key)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 text-sm w-full transition-colors
                  ${
                    key === currentStatus
                      ? "bg-gray-50 font-semibold"
                      : "hover:bg-gray-50"
                  }
                `}
                style={{ color: value.color }}
              >
                {key === currentStatus && <Check size={14} />}
                {value.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation pour rejet */}
      <ConfirmDialog
        isOpen={confirmStatus !== null}
        onClose={() => setConfirmStatus(null)}
        onConfirm={handleConfirmReject}
        title="Rejeter le signalement"
        message="Êtes-vous sûr de vouloir rejeter ce signalement ? Cette action est irréversible."
        confirmLabel="Rejeter"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}