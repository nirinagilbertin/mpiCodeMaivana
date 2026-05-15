import { useState, useEffect, useCallback, useRef } from 'react';
import { ResourceZone, ResourceFlow, PriorityScore } from '../types/resources';
import { mockZones, getZoneStatus } from '../mocks/resources';

const SIMULATION_INTERVAL = 4000;

function varyZones(zones: ResourceZone[]): ResourceZone[] {
  return zones.map(zone => ({
    ...zone,
    level: Math.max(5, Math.min(100, zone.level + (Math.random() - 0.5) * 15)),
    incidents: Math.max(0, Math.min(10, zone.incidents + Math.floor(Math.random() * 3) - 1)),
    consommation: Math.max(10, Math.min(100, zone.consommation + (Math.random() - 0.5) * 10)),
  }));
}

function generateFlows(zones: ResourceZone[]): ResourceFlow[] {
  const flows: ResourceFlow[] = [];
  const critical = zones.filter(z => getZoneStatus(z) === 'critical');
  const normal = zones.filter(z => getZoneStatus(z) === 'normal');

  // Pour chaque zone critique, puiser dans 2 zones normales du même type
  critical.forEach(crit => {
    const sameTypeNormal = normal.filter(n => n.type === crit.type).slice(0, 2);
    sameTypeNormal.forEach(norm => {
      flows.push({
        fromZoneId: norm.id,
        toZoneId: crit.id,
        type: crit.type,
        amount: Math.floor(Math.random() * 60) + 20,
      });
    });
  });

  return flows;
}

export function useResourceSimulation() {
  const [zones, setZones] = useState<ResourceZone[]>(mockZones);
  const [running, setRunning] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const scores: PriorityScore[] = zones.map(zone => ({
    zoneId: zone.id,
    score: zone.level,
    status: getZoneStatus(zone),
  }));

  const flows: ResourceFlow[] = generateFlows(zones);

  const tick = useCallback(() => {
    setZones(prev => varyZones(prev));
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, SIMULATION_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  return { zones, scores, flows, running, lastUpdate, togglePause: () => setRunning(!running) };
}