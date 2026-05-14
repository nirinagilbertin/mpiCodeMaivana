import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { FadeIn, Card, Loader } from '../../components';
import { MapPin, AlertCircle } from 'lucide-react';

const CriticalZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await adminService.getCriticalZones();
      setZones(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <FadeIn>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Zones critiques détectées</h1>
        <p className="text-gray-500">Zones avec au moins 3 signalements non résolus</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold">{zone.address}</h3>
                  <p className="text-sm text-gray-600">Signalements : {zone.reportCount}</p>
                  <p className="text-sm text-gray-600">Sévérité moyenne : {zone.avgSeverity?.toFixed(1)}/4</p>
                  {zone.latitude && zone.longitude && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${zone.latitude}&mlon=${zone.longitude}#map=15/${zone.latitude}/${zone.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm flex items-center gap-1 mt-2"
                    >
                      <MapPin size={14} /> Voir sur la carte
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};

export default CriticalZones;