import { ResourceZone } from '../types/resources';

export const mockZones: ResourceZone[] = [
  // Eau
  { id: "w1", name: "Réservoir Centre-ville", lat: -21.4536, lng: 47.0858, type: "water", level: 78, incidents: 1, consommation: 65 },
  { id: "w2", name: "Château d'eau Anjoma", lat: -21.4600, lng: 47.0780, type: "water", level: 22, incidents: 4, consommation: 88 },
  { id: "w3", name: "Réservoir Ambalapaiso", lat: -21.4450, lng: 47.0950, type: "water", level: 55, incidents: 2, consommation: 60 },
  { id: "w4", name: "Station pompage Tanambao", lat: -21.4480, lng: 47.0720, type: "water", level: 90, incidents: 0, consommation: 40 },
  { id: "w5", name: "Réservoir Andrainjato", lat: -21.4650, lng: 47.0900, type: "water", level: 15, incidents: 6, consommation: 95 },
  
  // Électricité
  { id: "e1", name: "Transformateur Centre", lat: -21.4520, lng: 47.0880, type: "electricity", level: 68, incidents: 1, consommation: 72 },
  { id: "e2", name: "Poste Ivory Avaratra", lat: -21.4400, lng: 47.0800, type: "electricity", level: 88, incidents: 3, consommation: 90 },
  { id: "e3", name: "Transformateur Ankofafa", lat: -21.4700, lng: 47.1000, type: "electricity", level: 35, incidents: 5, consommation: 78 },
  { id: "e4", name: "Poste Mahamanina", lat: -21.4500, lng: 47.1050, type: "electricity", level: 50, incidents: 0, consommation: 45 },
  { id: "e5", name: "Transformateur Andoharanofotsy", lat: -21.4380, lng: 47.0880, type: "electricity", level: 72, incidents: 2, consommation: 60 },
];

export function getZoneStatus(zone: ResourceZone): 'critical' | 'warning' | 'normal' {
  // Critique si niveau bas OU beaucoup d'incidents
  if (zone.level < 30 || zone.incidents >= 5) return 'critical';
  if (zone.level < 55 || zone.incidents >= 3) return 'warning';
  return 'normal';
}