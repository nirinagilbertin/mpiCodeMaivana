import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
// @ts-ignore pour éviter les problèmes de types avec Leaflet dans Create React App
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { ResourceZone, PriorityScore } from '../../types/resources';
import { Droplets, Zap } from 'lucide-react';

const FIANAR_CENTER: LatLngExpression = [-21.4536, 47.0858];
const FIANAR_ZOOM = 14;

function Recenter() {
  const map = useMap();
  useEffect(() => { map.setView(FIANAR_CENTER, FIANAR_ZOOM); }, [map]);
  return null;
}

function getColor(zone: ResourceZone, score?: PriorityScore): string {
  if (!score) return '#94A3B8';
  if (score.status === 'critical') return '#EF4444';
  if (score.status === 'warning') return '#F59E0B';
  return '#10B981';
}

interface ResourceMapProps {
  zones: ResourceZone[];
  scores: PriorityScore[];
  children?: React.ReactNode;
}

export default function ResourceMap({ zones, scores, children }: ResourceMapProps) {
  return (
    <MapContainer
      center={FIANAR_CENTER}
      zoom={FIANAR_ZOOM}
      className="w-full h-full"
      style={{ height: '100%', borderRadius: '1rem' }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter />

      {zones.map(zone => {
        const score = scores.find(s => s.zoneId === zone.id);
        const color = getColor(zone, score);
        const radius = 200 + (score ? (score.score / 100) * 250 : 0);
        const isCritical = score?.status === 'critical';

        return (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.35,
              weight: isCritical ? 3 : 2,
            }}
            className={isCritical ? 'animate-pulse' : ''}
          >
            <Popup>
              <div className="min-w-[180px] text-sm">
                <div className="flex items-center gap-2 mb-2">
                  {zone.type === 'water' ? (
                    <Droplets size={16} className="text-blue-500" />
                  ) : (
                    <Zap size={16} className="text-amber-500" />
                  )}
                  <strong className="text-gray-900">{zone.name}</strong>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div>Niveau : <span className="font-medium" style={{ color }}>{zone.level}%</span></div>
                  <div>Incidents : {zone.incidents}</div>
                  <div>Consommation : {zone.consommation}%</div>
                </div>
                <div className={`mt-2 px-2 py-1 rounded-md text-xs font-semibold text-white inline-block ${
                  score?.status === 'critical' ? 'bg-red-500' :
                  score?.status === 'warning' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}>
                  {score?.status === 'critical' ? '⚠ Critique' :
                   score?.status === 'warning' ? '● Alerte' : '● Normal'}
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}

      {children}
    </MapContainer>
  );
}