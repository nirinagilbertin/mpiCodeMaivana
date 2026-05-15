export type ResourceType = 'water' | 'electricity';

export interface ResourceZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: ResourceType;
  level: number;           // 0-100 (niveau réservoir ou charge réseau)
  incidents: number;       // 0-10
  consommation: number;    // 0-100 (% de la normale)
}

export type ZoneStatus = 'critical' | 'warning' | 'normal';

export interface PriorityScore {
  zoneId: string;
  score: number;
  status: ZoneStatus;
}

export interface ResourceFlow {
  fromZoneId: string;
  toZoneId: string;
  type: ResourceType;
  amount: number;
}