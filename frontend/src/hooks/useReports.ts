import { useState, useEffect, useCallback } from "react";
import type { ReportWithRelations } from "../types/report";
import {
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  getReportsStats,
} from "../services/reports";

interface UseReportsOptions {
  categoryId?: number;
  status?: string;
  urgency?: string;
}

export function useReports(options?: UseReportsOptions) {
  const [reports, setReports] = useState<ReportWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports(options);
      setReports(data);
    } catch (err) {
      setError("Erreur lors du chargement des signalements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [options?.categoryId, options?.status, options?.urgency]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const addReport = async (
    data: Parameters<typeof createReport>[0]
  ): Promise<ReportWithRelations | null> => {
    try {
      const newReport = await createReport(data);
      setReports((prev) => [newReport, ...prev]);
      return newReport;
    } catch (err) {
      setError("Erreur lors de la création du signalement");
      console.error(err);
      return null;
    }
  };

  const changeStatus = async (
    id: number,
    status: Parameters<typeof updateReportStatus>[1],
    adminComment?: string
  ): Promise<ReportWithRelations | null> => {
    try {
      const updated = await updateReportStatus(id, status, adminComment);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
      return updated;
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(err);
      return null;
    }
  };

  return { reports, loading, error, fetchReports, addReport, changeStatus };
}

export function useReportById(id: number | null) {
  const [report, setReport] = useState<ReportWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getReportById(id)
      .then(setReport)
      .catch((err) => {
        setError("Signalement introuvable");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { report, loading, error };
}

export function useReportsStats() {
  const [stats, setStats] = useState<Awaited<
    ReturnType<typeof getReportsStats>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportsStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}