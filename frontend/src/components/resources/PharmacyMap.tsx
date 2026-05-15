import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, divIcon } from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Pharmacy, TrashBin, getTrashBinStatus, getTrashBinColor, getTrashBinLabel } from '../../types/resources';
import { Pill, Phone, MapPin, Clock, Shield, Trash2, AlertTriangle } from 'lucide-react';

const FIANAR_CENTER: LatLngExpression = [-21.4536, 47.0858];
const FIANAR_ZOOM = 14;

function Recenter() {
  const map = useMap();
  useEffect(() => { map.setView(FIANAR_CENTER, FIANAR_ZOOM); }, [map]);
  return null;
}

// ==================== ICÔNES ====================
function createPharmacyIcon(isOnDuty: boolean) {
  const color = isOnDuty ? '#10B981' : '#F59E0B';
  
  return divIcon({
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 16px ${color}60, 0 4px 12px rgba(0,0,0,0.2);
        border: 3px solid white;
        animation: ${isOnDuty ? 'pulse 2s infinite' : 'none'};
        cursor: pointer;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        ${isOnDuty ? `
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            background: #10B981;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px #10B981;
          "/>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px ${color}60, 0 4px 12px rgba(0,0,0,0.2); }
          50% { transform: scale(1.12); box-shadow: 0 0 24px ${color}90, 0 4px 16px rgba(0,0,0,0.3); }
        }
      </style>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function createTrashBinIcon(reports: number, status: ReturnType<typeof getTrashBinStatus>) {
  const color = getTrashBinColor(status);
  const size = 36 + (reports * 3); // Plus de signalements = plus grand
  
  return divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 ${10 + reports}px ${color}80, 0 4px 12px rgba(0,0,0,0.2);
        border: 3px solid white;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        <svg width="${16 + reports}" height="${16 + reports}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-2 14H7L5 6"/>
          <path d="M10 11v6"/>
          <path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
        ${reports >= 8 ? `
          <div style="
            position: absolute;
            top: -6px;
            right: -6px;
            width: 20px;
            height: 20px;
            background: #EF4444;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 0 10px #EF4444;
          ">!</div>
        ` : ''}
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

// ==================== PROPS ====================
interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  trashBins: TrashBin[];
  onPharmacyClick?: (pharmacy: Pharmacy) => void;
  onTrashBinClick?: (trashBin: TrashBin) => void;
}

export default function PharmacyMap({ pharmacies, trashBins, onPharmacyClick, onTrashBinClick }: PharmacyMapProps) {
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

      {/* Marqueurs Pharmacies */}
      {pharmacies.map(pharmacy => (
        <Marker
          key={`pharmacy-${pharmacy.id}`}
          position={[pharmacy.lat, pharmacy.lng]}
          icon={createPharmacyIcon(pharmacy.isOnDuty)}
          eventHandlers={{ click: () => onPharmacyClick?.(pharmacy) }}
        >
          <Popup>
            <div className="min-w-[220px]">
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
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marqueurs Bacs à Ordures */}
      {trashBins.map(bin => {
        const status = getTrashBinStatus(bin.reports);
        return (
          <Marker
            key={`trash-${bin.id}`}
            position={[bin.lat, bin.lng]}
            icon={createTrashBinIcon(bin.reports, status)}
            eventHandlers={{ click: () => onTrashBinClick?.(bin) }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Trash2 size={16} className="text-gray-500" />
                  <strong className="text-sm text-gray-900">{bin.name}</strong>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{bin.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-600">{bin.reports} signalement{bin.reports > 1 ? 's' : ''}</span>
                  </div>
                  <div>
                    <span 
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: getTrashBinColor(status) }}
                    >
                      {getTrashBinLabel(status)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}