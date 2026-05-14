import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportService, categoryService } from '../services/reportService';
import { FadeIn, Card, Button, Loader, PillFilter } from '../components';
import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const statusLabels = {
  pending: 'En attente',
  validated: 'Validé',
  in_progress: 'En cours',
  resolved: 'Résolu',
  rejected: 'Rejeté',
};

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ status: '', categoryId: '', urgency: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchReports(true);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async (reset = false) => {
    if (reset) setPage(1);
    setLoading(true);
    try {
      const params = { page: reset ? 1 : page, limit: 10, ...filters };
      const res = await reportService.getAll(params);
      const newReports = res.data.data.reports;
      if (reset) {
        setReports(newReports);
      } else {
        setReports(prev => [...prev, ...newReports]);
      }
      setHasMore(newReports.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(p => p + 1);
      fetchReports();
    }
  };

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Signalements citoyens</h1>
          <Link to="/create-report">
            <Button>Nouveau signalement</Button>
          </Link>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <select
            className="border border-gray-200 rounded-full px-4 py-1.5 text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Tous statuts</option>
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <select
            className="border border-gray-200 rounded-full px-4 py-1.5 text-sm"
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          >
            <option value="">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            className="border border-gray-200 rounded-full px-4 py-1.5 text-sm"
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          >
            <option value="">Toute urgence</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="critical">Critique</option>
          </select>
        </div>

        {/* Liste */}
        {loading && reports.length === 0 ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <Link to={`/reports/${report.id}`} key={report.id}>
                <Card className="p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{report.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyColors[report.urgency]}`}>
                          {report.urgency}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {report.Category?.name}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {statusLabels[report.status]}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {report.address || 'Adresse non précisée'}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {report.photoUrl && (
                      <img src={report.photoUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                    )}
                  </div>
                </Card>
              </Link>
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={loadMore} disabled={loading}>Charger plus</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default ReportsList;