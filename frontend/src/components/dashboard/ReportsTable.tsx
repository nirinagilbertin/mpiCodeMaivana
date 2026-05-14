import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import type { ReportWithRelations } from "../../types/report";
import { formatRelativeTime } from "../../utils/formatDate";
import { getUrgencyLabel, getUrgencyColor } from "../../utils/getUrgencyColor";
import { getStatusLabel, getStatusColor } from "../../utils/getStatusColor";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Input from "../ui/Input";
import EmptyState from "../ui/EmptyState";

interface ReportsTableProps {
  reports: ReportWithRelations[];
  loading?: boolean;
  onViewReport?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

type SortKey = "date" | "urgency" | "status";
type SortDir = "asc" | "desc";

export default function ReportsTable({
  reports,
  loading = false,
  onViewReport,
  onStatusChange,
}: ReportsTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredReports = reports
    .filter(
      (r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const urgencyOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      const statusOrder = {
        pending: 0,
        validated: 1,
        in_progress: 2,
        resolved: 3,
        rejected: 4,
      };

      let comparison = 0;
      if (sortKey === "date") {
        comparison =
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime();
      } else if (sortKey === "urgency") {
        comparison =
          (urgencyOrder[a.urgency] || 0) - (urgencyOrder[b.urgency] || 0);
      } else if (sortKey === "status") {
        comparison =
          (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      }

      return sortDir === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return (
      <Card padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-full bg-gray-100 rounded-xl" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Barre de recherche */}
      <div className="p-4 border-b border-gray-100">
        <Input
          placeholder="Rechercher un signalement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* Tableau */}
      {filteredReports.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="Aucun signalement"
            description="Aucun résultat pour cette recherche."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Signalement
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("urgency")}
                >
                  <span className="inline-flex items-center gap-1">
                    Urgence
                    {sortKey === "urgency" &&
                      (sortDir === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("status")}
                >
                  <span className="inline-flex items-center gap-1">
                    Statut
                    {sortKey === "status" &&
                      (sortDir === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("date")}
                >
                  <span className="inline-flex items-center gap-1">
                    Date
                    {sortKey === "date" &&
                      (sortDir === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {report.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {report.address || "Sans adresse"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={getUrgencyColor(report.urgency)}
                      size="sm"
                    >
                      {getUrgencyLabel(report.urgency)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={getStatusColor(report.status)}
                      size="sm"
                    >
                      {getStatusLabel(report.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(report.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === report.id ? null : report.id
                        )
                      }
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* Menu contextuel */}
                    {openMenuId === report.id && (
                      <div className="absolute right-4 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                        <button
                          onClick={() => {
                            onViewReport?.(report.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 w-full"
                        >
                          <Eye size={14} />
                          Voir les détails
                        </button>
                        <div className="border-t border-gray-50 my-1" />
                        <p className="px-3 py-1 text-xs text-gray-400">
                          Changer statut
                        </p>
                        {["validated", "in_progress", "resolved", "rejected"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => {
                                onStatusChange?.(report.id, status);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 w-full"
                              style={{
                                color: getStatusColor(status),
                              }}
                            >
                              {getStatusLabel(status)}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}