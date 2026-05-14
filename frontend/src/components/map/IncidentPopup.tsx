import { Link } from "react-router-dom";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import type { ReportWithRelations } from "../../types/report";
import { formatRelativeTime } from "../../utils/formatDate";
import { getUrgencyLabel } from "../../utils/getUrgencyColor";
import { getStatusLabel, getStatusColor } from "../../utils/getStatusColor";
import Badge from "../ui/Badge";

interface IncidentPopupProps {
  report: ReportWithRelations;
}

export default function IncidentPopup({ report }: IncidentPopupProps) {
  return (
    <div className="min-w-[220px] p-1">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {report.title}
        </h3>
      </div>

      {/* Métadonnées */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} />
          <span className="truncate">{report.address || "Position GPS"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} />
          <span>{formatRelativeTime(report.createdAt)}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge color={getUrgencyLabel(report.urgency) === "Faible" ? "#6B7280" : "#EF4444"} size="sm">
          <AlertTriangle size={10} />
          {getUrgencyLabel(report.urgency)}
        </Badge>
        <Badge color={getStatusColor(report.status)} size="sm">
          {getStatusLabel(report.status)}
        </Badge>
      </div>

      {/* Description */}
      {report.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {report.description}
        </p>
      )}

      {/* Photo miniature */}
      {report.photoUrl && (
        <img
          src={report.photoUrl}
          alt={report.title}
          className="w-full h-20 object-cover rounded-lg mb-3"
        />
      )}

      {/* Action */}
      <Link
        to={`/reports/${report.id}`}
        className="block w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg py-1.5 transition-colors"
      >
        Voir les détails
      </Link>
    </div>
  );
}