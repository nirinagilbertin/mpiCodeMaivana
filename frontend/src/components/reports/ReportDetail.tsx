import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  User,
  MessageSquare,
} from "lucide-react";
import type { ReportWithRelations } from "../../types/report";
import { formatDate } from "../../utils/formatDate";
import { getUrgencyLabel, getUrgencyColor } from "../../utils/getUrgencyColor";
import { getStatusLabel, getStatusColor } from "../../utils/getStatusColor";
import { getCategoryIcon } from "../../utils/getCategoryIcon";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface ReportDetailProps {
  report: ReportWithRelations;
}

export default function ReportDetail({ report }: ReportDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      {/* Photo */}
      {report.photoUrl && (
        <div className="rounded-2xl overflow-hidden h-64 sm:h-80 shadow-md">
          <img
            src={report.photoUrl}
            alt={report.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* En-tête */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge color={getUrgencyColor(report.urgency)}>
            <AlertTriangle size={12} />
            {getUrgencyLabel(report.urgency)}
          </Badge>
          <Badge color={getStatusColor(report.status)}>
            {report.status === "resolved" && <CheckCircle size={12} />}
            {getStatusLabel(report.status)}
          </Badge>
          {report.category && (
            <Badge color={report.category.color || "#6B7280"}>
              {getCategoryIcon(report.category.name)} {report.category.name}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {report.title}
        </h1>
      </div>

      {/* Infos principales */}
      <Card padding="lg">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Localisation</p>
              <p className="text-sm text-gray-500">
                {report.address || `${report.latitude}, ${report.longitude}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-sm text-gray-500">
                {formatDate(report.createdAt)}
              </p>
            </div>
          </div>

          {report.user && (
            <div className="flex items-start gap-3">
              <User size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Signalé par</p>
                <p className="text-sm text-gray-500">
                  {report.user.fullName}
                  {report.user.neighborhood
                    ? ` (${report.user.neighborhood})`
                    : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Description */}
      <Card padding="lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Description
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {report.description || "Aucune description fournie."}
        </p>
      </Card>

      {/* Commentaire admin */}
      {report.adminComment && (
        <Card padding="lg" className="border-l-4 border-l-purple-500">
          <div className="flex items-start gap-3">
            <MessageSquare
              size={18}
              className="text-purple-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">
                Réponse de l'administration
              </p>
              <p className="text-sm text-gray-600">{report.adminComment}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Résolution */}
      {report.resolvedAt && (
        <Card padding="lg" className="border-l-4 border-l-green-500">
          <div className="flex items-start gap-3">
            <CheckCircle
              size={18}
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">
                Résolu le {formatDate(report.resolvedAt)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}