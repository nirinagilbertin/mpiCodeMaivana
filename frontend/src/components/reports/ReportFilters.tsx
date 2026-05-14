import { useState } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "../../hooks/useCategories";
import { REPORT_STATUS, URGENCY_LEVELS } from "../../config/constants";
import Button from "../ui/Button";

interface ReportFiltersProps {
  filters: {
    categoryId?: number;
    status?: string;
    urgency?: string;
  };
  onChange: (filters: {
    categoryId?: number;
    status?: string;
    urgency?: string;
  }) => void;
}

export default function ReportFilters({
  filters,
  onChange,
}: ReportFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useCategories();

  const hasActiveFilters =
    filters.categoryId || filters.status || filters.urgency;

  const clearFilters = () => onChange({});

  return (
    <div className="relative">
      <Button
        variant={hasActiveFilters ? "primary" : "secondary"}
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        icon={<Filter size={16} />}
      >
        Filtres
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Filtrer par
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={12} />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Catégories */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Catégorie
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={filters.categoryId === cat.id}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categoryId:
                            filters.categoryId === cat.id
                              ? undefined
                              : cat.id,
                        })
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {cat.icon} {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Statut
              </label>
              <div className="space-y-1">
                {Object.entries(REPORT_STATUS).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === key}
                      onChange={() =>
                        onChange({
                          ...filters,
                          status: filters.status === key ? undefined : key,
                        })
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {value.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Urgence */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Urgence
              </label>
              <div className="space-y-1">
                {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="urgency"
                      checked={filters.urgency === key}
                      onChange={() =>
                        onChange({
                          ...filters,
                          urgency:
                            filters.urgency === key ? undefined : key,
                        })
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {value.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}