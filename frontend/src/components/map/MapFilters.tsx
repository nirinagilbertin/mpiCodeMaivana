import { useState } from "react";
import { Filter, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "../../hooks/useCategories";
import { REPORT_STATUS, URGENCY_LEVELS } from "../../config/constants";

interface MapFiltersProps {
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

export default function MapFilters({ filters, onChange }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useCategories();

  const hasActiveFilters = filters.categoryId || filters.status || filters.urgency;

  const clearFilters = () => {
    onChange({});
  };

  return (
    <div className="relative">
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
          ${
            hasActiveFilters
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-200 hover:bg-white"
          }
        `}
      >
        <Filter size={14} />
        Filtres
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-white" />
        )}
      </button>

      {/* Panel filtres */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Filtres</h3>
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
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Catégorie
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      onChange({
                        ...filters,
                        categoryId:
                          filters.categoryId === cat.id ? undefined : cat.id,
                      })
                    }
                    className={`
                      text-xs px-2 py-1 rounded-lg border transition-colors flex items-center gap-1
                      ${
                        filters.categoryId === cat.id
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }
                    `}
                  >
                    {filters.categoryId === cat.id && <Check size={10} />}
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Statut
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(REPORT_STATUS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() =>
                      onChange({
                        ...filters,
                        status: filters.status === key ? undefined : key,
                      })
                    }
                    className="text-xs px-2 py-1 rounded-lg border transition-colors"
                    style={{
                      borderColor:
                        filters.status === key ? value.color : "#e5e7eb",
                      backgroundColor:
                        filters.status === key ? value.color + "15" : "white",
                      color:
                        filters.status === key ? value.color : "#6b7280",
                    }}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgence */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Urgence
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() =>
                      onChange({
                        ...filters,
                        urgency: filters.urgency === key ? undefined : key,
                      })
                    }
                    className="text-xs px-2 py-1 rounded-lg border transition-colors"
                    style={{
                      borderColor:
                        filters.urgency === key ? value.color : "#e5e7eb",
                      backgroundColor:
                        filters.urgency === key ? value.color + "15" : "white",
                      color:
                        filters.urgency === key ? value.color : "#6b7280",
                    }}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}