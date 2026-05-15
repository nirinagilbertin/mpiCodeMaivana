import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, divIcon } from 'leaflet';
// @ts-ignore - Leaflet n'a pas de types pour divIcon
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Pharmacy } from '../../types/resources';
import { Pill, Phone, MapPin, Clock, Shield } from 'lucide-react';

const FIANAR_CENTER: LatLngExpression = [-21.4536, 47.0858];
const FIANAR_ZOOM = 14;

function Recenter() {
  const map = useMap();
  useEffect(() => { map.setView(FIANAR_CENTER, FIANAR_ZOOM); }, [map]);
  return null;
}

function createPharmacyIcon(isOnDuty: boolean) {
  const color = isOnDuty ? '#10B981' : '#F59E0B';
  const glow = isOnDuty ? '#10B981' : '#F59E0B';
  
  return divIcon({
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 16px ${glow}80, 0 0 32px ${glow}40, 0 4px 12px rgba(0,0,0,0.2);
        border: 3px solid white;
        animation: ${isOnDuty ? 'pulse 2s infinite' : 'none'};
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="1"/>
          <rect x="13" y="3" width="8" height="8" rx="1"/>
          <rect x="3" y="13" width="8" height="8" rx="1"/>
          <rect x="13" y="13" width="8" height="8" rx="1"/>
        </svg>
        ${isOnDuty ? `
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 14px;
            height: 14px;
            background: #10B981;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 8px #10B981;
          "/>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      </style>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  onPharmacyClick?: (pharmacy: Pharmacy) => void;
}

export default function ResourceMap({ pharmacies, onPharmacyClick }: PharmacyMapProps) {
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

      {pharmacies.map(pharmacy => (
        <Marker
          key={pharmacy.id}
          position={[pharmacy.lat, pharmacy.lng]}
          icon={createPharmacyIcon(pharmacy.isOnDuty)}
          eventHandlers={{
            click: () => onPharmacyClick?.(pharmacy),
          }}
        >
          <Popup>
            <div className="min-w-[220px]">
              {/* En-tête */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <div className={`p-1.5 rounded-lg ${pharmacy.isOnDuty ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  <Pill size={16} className={pharmacy.isOnDuty ? 'text-emerald-600' : 'text-amber-600'} />
                </div>
                <div>
                  <strong className="text-sm text-gray-900">{pharmacy.name}</strong>
                  <div className={`text-xs font-semibold ${pharmacy.isOnDuty ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {pharmacy.isOnDuty ? '🟢 En garde' : '🟡 Non gardée'}
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-600">{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">{pharmacy.phone}</span>
                </div>
                {pharmacy.isOnDuty && pharmacy.dutyStart && pharmacy.dutyEnd && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-600">
                      Garde : {new Date(pharmacy.dutyStart).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} 
                      → {new Date(pharmacy.dutyEnd).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Badge admin */}
              {pharmacy.createdBy && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield size={10} />
                  Ajoutée par admin
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}