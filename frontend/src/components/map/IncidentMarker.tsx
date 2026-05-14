import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { ReportWithRelations } from "../../types/report";
import { getUrgencyColor } from "../../utils/getUrgencyColor";
import { getCategoryIcon } from "../../utils/getCategoryIcon";
import IncidentPopup from "./IncidentPopup";

// Correction du bug des icônes Leaflet par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface IncidentMarkerProps {
  report: ReportWithRelations;
}

export default function IncidentMarker({ report }: IncidentMarkerProps) {
  const urgencyColor = getUrgencyColor(report.urgency);
  const categoryIcon = getCategoryIcon(report.category?.name);

  // Icône personnalisée selon l'urgence
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${urgencyColor};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 14px;
        ">${categoryIcon}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <Marker
      position={[report.latitude, report.longitude]}
      icon={customIcon}
    >
      <Popup>
        <IncidentPopup report={report} />
      </Popup>
    </Marker>
  );
}