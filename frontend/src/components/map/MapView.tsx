import { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
// @ts-ignore - Leaflet CSS import for map styles
import "leaflet/dist/leaflet.css";
import { MAP_CENTER, MAP_ZOOM_DEFAULT } from "../../config/constants";
import { useReports } from "../../hooks/useReports";
import IncidentMarker from "./IncidentMarker";
import HeatmapLayer from "./HeatmapLayer";
import MapFilters from "./MapFilters";
import Spinner from "../ui/Spinner";

// Composant interne pour recentrer la carte
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: false });
    }
  }, [center, map]);

  return null;
}

// Composant interne pour capturer les clics sur la carte
function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapViewProps {
  center?: LatLngExpression;
  onMapClick?: (lat: number, lng: number) => void;
  selectable?: boolean;
  showHeatmap?: boolean;
  height?: number;  // en pixels
}

export default function MapView({
  center = [MAP_CENTER.lat, MAP_CENTER.lng],
  onMapClick,
  selectable = false,
  showHeatmap = false,
  height = 600,
}: MapViewProps) {
  const [filters, setFilters] = useState<{
    categoryId?: number;
    status?: string;
    urgency?: string;
  }>({});
  const { reports, loading } = useReports(filters);

  const filteredReports = useMemo(() => {
    return reports;
  }, [reports]);

  if (loading) {
    return (
      <div
        className="bg-gray-100 rounded-2xl flex items-center justify-center"
        style={{ height: '600px' }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Filtres superposés sur la carte */}
      <div className="absolute top-3 left-3 z-[1000]">
        <MapFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Indicateur de densité */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-gray-100">
        <span className="text-xs font-medium text-gray-600">
          {filteredReports.length} incident{filteredReports.length > 1 ? "s" : ""}
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={MAP_ZOOM_DEFAULT}
        className="w-full z-0"
        style={{ height: '600px' }}   // ← remplace ${height}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectable && onMapClick && (
          <MapClickHandler onClick={onMapClick} />
        )}

        {/* Marqueurs d'incidents */}
        {filteredReports.map((report) => (
          <IncidentMarker key={report.id} report={report} />
        ))}

        {/* Couche heatmap */}
        {showHeatmap && <HeatmapLayer reports={filteredReports} />}
      </MapContainer>
    </div>
  );
}