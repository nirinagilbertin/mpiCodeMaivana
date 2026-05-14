import type { Report, ReportWithRelations } from "../types/report";
import { mockReports } from "../mocks/reports";
import { USE_MOCKS } from "./api";
import apiClient from "./api";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Récupère tous les signalements
 */
export async function getReports(
  filters?: {
    categoryId?: number;
    status?: string;
    urgency?: string;
  }
): Promise<ReportWithRelations[]> {
  if (USE_MOCKS) {
    let filtered = [...mockReports];

    if (filters?.categoryId) {
      filtered = filtered.filter((r) => r.categoryId === filters.categoryId);
    }
    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters?.urgency) {
      filtered = filtered.filter((r) => r.urgency === filters.urgency);
    }

    return filtered;
  }

  const response = await apiClient.get(ENDPOINTS.REPORTS.BASE, {
    params: filters,
  });
  return response.data;
}

/**
 * Récupère un signalement par son ID
 */
export async function getReportById(
  id: number
): Promise<ReportWithRelations | null> {
  if (USE_MOCKS) {
    return mockReports.find((r) => r.id === id) ?? null;
  }

  const response = await apiClient.get(ENDPOINTS.REPORTS.BY_ID(id));
  return response.data;
}

/**
 * Crée un nouveau signalement
 */
export async function createReport(
  data: Omit<Report, "id" | "createdAt" | "updatedAt" | "status">
): Promise<ReportWithRelations> {
  if (USE_MOCKS) {
    const newReport: ReportWithRelations = {
      ...data,
      id: mockReports.length + 1,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 1,
        email: "jean.rakoto@email.com",
        fullName: "Jean Rakoto",
        role: "citizen",
        isActive: true,
      },
      category: {
        id: data.categoryId,
        name: "Catégorie",
        isActive: true,
      },
    };
    mockReports.unshift(newReport);
    return newReport;
  }

  const response = await apiClient.post(ENDPOINTS.REPORTS.BASE, data);
  return response.data;
}

/**
 * Met à jour le statut d'un signalement (admin)
 */
export async function updateReportStatus(
  id: number,
  status: Report["status"],
  adminComment?: string
): Promise<ReportWithRelations> {
  if (USE_MOCKS) {
    const report = mockReports.find((r) => r.id === id);
    if (!report) throw new Error("Signalement non trouvé");

    report.status = status;
    report.updatedAt = new Date().toISOString();
    if (adminComment) report.adminComment = adminComment;
    if (status === "resolved") report.resolvedAt = new Date().toISOString();

    return report;
  }

  const response = await apiClient.patch(ENDPOINTS.REPORTS.BY_ID(id), {
    status,
    adminComment,
  });
  return response.data;
}

/**
 * Récupère les statistiques des signalements
 */
export async function getReportsStats(): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byCategory: { categoryId: number; categoryName: string; count: number }[];
  byUrgency: { urgency: string; count: number }[];
}> {
  if (USE_MOCKS) {
    const total = mockReports.length;
    const pending = mockReports.filter((r) => r.status === "pending").length;
    const inProgress = mockReports.filter(
      (r) => r.status === "in_progress"
    ).length;
    const resolved = mockReports.filter((r) => r.status === "resolved").length;

    const byCategory = [
      { categoryId: 1, categoryName: "Eau", count: 2 },
      { categoryId: 2, categoryName: "Déchets", count: 2 },
      { categoryId: 3, categoryName: "Sécurité", count: 2 },
      { categoryId: 4, categoryName: "Transport", count: 2 },
      { categoryId: 5, categoryName: "Éclairage", count: 1 },
      { categoryId: 6, categoryName: "Routes", count: 1 },
    ];

    const byUrgency = [
      { urgency: "low", count: 1 },
      { urgency: "medium", count: 4 },
      { urgency: "high", count: 3 },
      { urgency: "critical", count: 2 },
    ];

    return { total, pending, inProgress, resolved, byCategory, byUrgency };
  }

  const response = await apiClient.get(ENDPOINTS.REPORTS.STATS);
  return response.data;
}