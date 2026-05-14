import { Link } from "react-router-dom";
import { MapPin, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import type { ReportWithRelations } from "../../types/report";
import { formatRelativeTime } from "../../utils/formatDate";
import { getUrgencyLabel, getUrgencyColor } from "../../utils/getUrgencyColor";
import { getStatusLabel, getStatusColor } from "../../utils/getStatusColor";
import { getCategoryIcon } from "../../utils/getCategoryIcon";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

interface ReportCardProps {
  report: ReportWithRelations;
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link to={`/reports/${report.id}`}>
      <Card hover padding="none" className="overflow-hidden">
        {/* Photo */}
        {report.photoUrl && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={report.photoUrl}
              alt={report.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-4">
          {/* En-tête */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {report.title}
            </h3>
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-0.5" />
          </div>

          {/* Métadonnées */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">
                {report.address || "Position GPS"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} className="flex-shrink-0" />
              <span>{formatRelativeTime(report.createdAt)}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {report.category && (
              <Badge color={report.category.color || "#6B7280"} size="sm">
                {getCategoryIcon(report.category.name)}{" "}
                {report.category.name}
              </Badge>
            )}
            <Badge color={getUrgencyColor(report.urgency)} size="sm">
              <AlertTriangle size={10} />
              {getUrgencyLabel(report.urgency)}
            </Badge>
          </div>

          {/* Description */}
          {report.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
              {report.description}
            </p>
          )}

          {/* Statut */}
          <div className="flex items-center justify-between">
            <Badge color={getStatusColor(report.status)} size="sm">
              {getStatusLabel(report.status)}
            </Badge>
            {report.user && (
              <span className="text-xs text-gray-400">
                par {report.user.fullName}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}