import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useReports } from "../../hooks/useReports";
import ReportCard from "./ReportCard";
import ReportFilters from "./ReportFilters";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import Input from "../ui/Input";

export default function ReportList() {
  const [filters, setFilters] = useState<{
    categoryId?: number;
    status?: string;
    urgency?: string;
  }>({});
  const [search, setSearch] = useState("");
  const { reports, loading, error } = useReports(filters);

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.address?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger les signalements pour le moment."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un signalement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <ReportFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="Aucun signalement trouvé"
          description={
            search || filters.categoryId || filters.status || filters.urgency
              ? "Essayez de modifier vos critères de recherche."
              : "Soyez le premier à signaler un problème dans votre quartier !"
          }
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {filteredReports.length} signalement
            {filteredReports.length > 1 ? "s" : ""} trouvé
            {filteredReports.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}