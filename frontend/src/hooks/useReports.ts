import { useState, useEffect, useCallback } from "react";
import type { ReportWithRelations } from "../types/report";
import { supabase } from "../lib/supabase";

// Garde l'import mock comme fallback
import { getReports, createReport, updateReportStatus, getReportsStats } from "../services/reports";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

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
      if (USE_MOCKS) {
        // ===== MODE MOCK =====
        const data = await getReports(options);
        setReports(data);
      } else {
        // ===== MODE SUPABASE 🔥 =====
        let query = supabase
          .from('reports')
          .select(`
            *,
            user:users(*),
            category:categories(*)
          `);

        if (options?.categoryId) {
          query = query.eq('category_id', options.categoryId);
        }
        if (options?.status) {
          query = query.eq('status', options.status);
        }
        if (options?.urgency) {
          query = query.eq('urgency', options.urgency);
        }

        const { data, error: supabaseError } = await query.order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        // 🔥 Mapper snake_case → camelCase
        const mappedData = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.address,
          urgency: item.urgency,
          status: item.status,
          photoUrl: item.photo_url,
          resolvedAt: item.resolved_at,
          adminComment: item.admin_comment,
          userId: item.user_id,
          categoryId: item.category_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          user: item.user ? {
            id: item.user.id,
            email: item.user.email,
            fullName: item.user.full_name,
            phone: item.user.phone,
            role: item.user.role,
            isActive: item.user.is_active,
            avatarUrl: item.user.avatar_url,
            neighborhood: item.user.neighborhood,
            createdAt: item.user.created_at,
            updatedAt: item.user.updated_at,
          } : undefined,
          category: item.category ? {
            id: item.category.id,
            name: item.category.name,
            icon: item.category.icon,
            color: item.category.color,
            isActive: item.category.is_active,
          } : undefined,
        }));

        setReports(mappedData as ReportWithRelations[]);
      }
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
      if (USE_MOCKS) {
        // ===== MODE MOCK =====
        const newReport = await createReport(data);
        setReports((prev) => [newReport, ...prev]);
        return newReport;
      } else {
        // ===== MODE SUPABASE 🔥 =====
        const { data: newReport, error } = await supabase
          .from('reports')
          .insert({
            title: data.title,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            urgency: data.urgency || 'medium',
            status: 'pending',
            user_id: data.userId,
            category_id: data.categoryId,
            photo_url: data.photoUrl,
            address: data.address
          })
          .select('*, user:users(*), category:categories(*)')
          .single();

        if (error) throw error;
        setReports((prev) => [newReport as ReportWithRelations, ...prev]);
        return newReport as ReportWithRelations;
      }
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
      if (USE_MOCKS) {
        // ===== MODE MOCK =====
        const updated = await updateReportStatus(id, status, adminComment);
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        );
        return updated;
      } else {
        // ===== MODE SUPABASE 🔥 =====
        const { data: updated, error } = await supabase
          .from('reports')
          .update({
            status,
            admin_comment: adminComment,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select('*, user:users(*), category:categories(*)')
          .single();

        if (error) throw error;
        setReports((prev) =>
          prev.map((r) => (r.id === id ? (updated as ReportWithRelations) : r))
        );
        return updated as ReportWithRelations;
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(err);
      return null;
    }
  };

  return { reports, loading, error, fetchReports, addReport, changeStatus };
}

// ===== useReportById =====
export function useReportById(id: number | null) {
  const [report, setReport] = useState<ReportWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    if (USE_MOCKS) {
      import("../services/reports").then(({ getReportById }) => {
        getReportById(id)
          .then(setReport)
          .catch((err) => {
            setError("Signalement introuvable");
            console.error(err);
          })
          .finally(() => setLoading(false));
      });
    } else {
      // 🔥 MODE SUPABASE avec mapping snake_case → camelCase
      Promise.resolve(
        supabase
          .from('reports')
          .select('*, user:users(*), category:categories(*)')
          .eq('id', id)
          .single()
      )
        .then(({ data, error: supabaseError }) => {
          if (supabaseError) throw supabaseError;

          // 🔥 Mapper les noms de colonnes
          if (data) {
            const mappedReport: ReportWithRelations = {
              id: data.id,
              title: data.title,
              description: data.description,
              latitude: data.latitude,
              longitude: data.longitude,
              address: data.address,
              urgency: data.urgency,
              status: data.status,
              photoUrl: data.photo_url,
              resolvedAt: data.resolved_at,
              adminComment: data.admin_comment,
              userId: data.user_id,
              categoryId: data.category_id,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              user: data.user ? {
                id: data.user.id,
                email: data.user.email,
                fullName: data.user.full_name,
                phone: data.user.phone,
                role: data.user.role,
                isActive: data.user.is_active,
                avatarUrl: data.user.avatar_url,
                neighborhood: data.user.neighborhood,
                createdAt: data.user.created_at,
                updatedAt: data.user.updated_at,
              } : undefined,
              category: data.category ? {
                id: data.category.id,
                name: data.category.name,
                icon: data.category.icon,
                color: data.category.color,
                isActive: data.category.is_active,
              } : undefined,
            };
            setReport(mappedReport);
          }
        })
        .catch((err) => {
          setError("Signalement introuvable");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return { report, loading, error };
}

// ===== useReportsStats (CORRIGÉ) =====
export function useReportsStats() {
  const [stats, setStats] = useState<Awaited<
    ReturnType<typeof getReportsStats>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCKS) {
      getReportsStats()
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      // ===== MODE SUPABASE 🔥 =====
      const fetchStats = async () => {
        try {
          const [totalRes, pendingRes, resolvedRes, criticalRes] = await Promise.all([
            supabase.from('reports').select('*', { count: 'exact', head: true }),
            supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
            supabase.from('reports').select('*', { count: 'exact', head: true }).eq('urgency', 'critical'),
          ]);

          setStats({
            total: totalRes.count || 0,
            pending: pendingRes.count || 0,
            inProgress: 0,
            resolved: resolvedRes.count || 0,
            byCategory: [],
            byUrgency: [],
          });
        } catch (err) {
          console.error('Erreur stats:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, []);

  return { stats, loading };
}