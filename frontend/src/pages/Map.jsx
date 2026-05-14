import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportService, categoryService } from '../services/reportService';
import { FadeIn, Loader, Card, Button } from '../components';
import { AlertCircle, MapPin, Filter } from 'lucide-react';

// Correction des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const urgencyColors = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const MapComponent = ({ reports }) => {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds);
    }
  }, [reports, map]);
  return null;
};

const Map = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ categoryId: '', urgency: '' });
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchReports();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.urgency) params.urgency = filters.urgency;
      const res = await reportService.getMapReports(params);
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const center = [-21.4517, 47.0875]; // Coordonnées approximatives de Fianarantsoa

  return (
    <FadeIn>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Carte des incidents</h1>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} icon={Filter}>
            Filtres
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4 flex flex-wrap gap-4">
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            >
              <option value="">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            >
              <option value="">Toute urgence</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="critical">Critique</option>
            </select>
          </Card>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="h-150 w-full rounded-2xl overflow-hidden border border-gray-200">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {reports.map(report => (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${urgencyColors[report.urgency]}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [24, 24],
                    popupAnchor: [0, -12],
                  })}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Urgence : {report.urgency}</p>
                      <Button size="sm" className="mt-2" onClick={() => window.location.href = `/reports/${report.id}`}>
                        Voir détails
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapComponent reports={reports} />
            </MapContainer>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default Map;