import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { ReportWithRelations } from "../../types/report";

interface HeatmapLayerProps {
  reports: ReportWithRelations[];
}

export default function HeatmapLayer({ reports }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!reports.length) return;

    let heatLayer: any = null;
    let isCancelled = false;

    const initHeatmap = async () => {
      if (isCancelled) return;

      try {
        await import("leaflet.heat");
        const L = await import("leaflet");

        const urgencyWeight: Record<string, number> = {
          low: 0.3,
          medium: 0.5,
          high: 0.8,
          critical: 1,
        };

        const heatPoints: Array<[number, number, number]> = reports.map(
          (report) => [
            report.latitude,
            report.longitude,
            urgencyWeight[report.urgency] || 0.5,
          ]
        );

        const heat = (L.default as any).heatLayer(heatPoints, {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          max: 1,
          gradient: {
            0.0: "rgba(0, 255, 0, 0)",
            0.3: "rgba(0, 255, 0, 0.5)",
            0.5: "rgba(255, 255, 0, 0.7)",
            0.7: "rgba(255, 165, 0, 0.8)",
            1.0: "rgba(255, 0, 0, 0.9)",
          },
        });

        if (isCancelled) return;

        // Attendre que le canvas de la carte ait une taille valide
        const addWhenReady = () => {
          if (isCancelled) return;

          const container = map.getContainer();
          const canvas = container.querySelector("canvas");

          // Si le canvas existe et a une hauteur > 0, on peut dessiner
          if (canvas && canvas.height > 0) {
            heatLayer = heat;
            heatLayer.addTo(map);
          } else {
            // Sinon on attend l'événement resize/load de la carte
            map.once("resize", addWhenReady);
            map.once("load", addWhenReady);
            // Fallback : réessayer après un court délai
            setTimeout(addWhenReady, 200);
          }
        };

        // Vérifier si la carte est déjà prête (container dimensionné)
        const size = map.getSize();
        if (size.x > 0 && size.y > 0) {
          addWhenReady();
        } else {
          map.once("resize", addWhenReady);
          map.once("load", addWhenReady);
        }
      } catch (error) {
        console.warn(
          "Heatmap non disponible. Installez leaflet.heat : npm install leaflet.heat"
        );
      }
    };

    // Invalider la taille de la carte pour forcer le recalcul du canvas
    map.invalidateSize();
    initHeatmap();

    return () => {
      isCancelled = true;
      if (heatLayer && map) {
        try {
          map.removeLayer(heatLayer);
        } catch (e) {
          // Ignore les erreurs de cleanup
        }
      }
    };
  }, [reports, map]);

  return null;
}