import { useReports } from "../../hooks/useReports";
import { useCategories } from "../../hooks/useCategories";
import CriticalZones from "../../components/dashboard/CriticalZones";

export default function CriticalZonesPage() {
  const { reports, loading } = useReports();
  const { categories } = useCategories();

  const criticalZones = (reports || [])
    .filter(r => r.urgency === 'critical' || r.urgency === 'high')
    .map(r => ({
      id: r.id,
      title: r.title,
      latitude: r.latitude,
      longitude: r.longitude,
      urgency: r.urgency,
      category: categories.find(c => c.id === r.categoryId)?.name || 'Inconnue',
      neighborhood: r.address || 'Fianarantsoa',
      incidentCount: 1,
      trend: 'stable' as 'stable' | 'up' | 'down',
      mainCategory: categories.find(c => c.id === r.categoryId)?.name || 'Inconnue',
      severity: (r.urgency === 'critical' ? 'high' : 'medium') as 'low' | 'medium' | 'high' // 🔥 CORRIGÉ
    }));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Zones Critiques</h1>
      <CriticalZones zones={criticalZones} loading={loading} />
    </div>
  );
}