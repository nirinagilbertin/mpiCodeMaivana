// ==================== PHARMACIES ====================
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  isOnDuty: boolean;
  dutyStart?: string;
  dutyEnd?: string;
  createdBy?: string;
  updatedAt?: string;
}

// ==================== BACS À ORDURES ====================
export type TrashBinStatus = 'empty' | 'low' | 'medium' | 'high' | 'overflow';

export interface TrashBin {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  reports: number;           // Nombre de signalements
  capacity: number;           // Capacité max (ex: 100)
  lastCollected?: string;     // Date dernier ramassage
  reportedBy?: string[];      // IDs des utilisateurs ayant signalé
}

export interface TrashBinReport {
  binId: string;
  userId: string;
  timestamp: string;
}

// Fonction utilitaire pour déterminer le statut
export function getTrashBinStatus(reports: number): TrashBinStatus {
  if (reports >= 8) return 'overflow';
  if (reports >= 5) return 'high';
  if (reports >= 3) return 'medium';
  if (reports >= 1) return 'low';
  return 'empty';
}

export function getTrashBinColor(status: TrashBinStatus): string {
  const colors = {
    empty: '#10B981',    // Vert
    low: '#84CC16',      // Lime
    medium: '#F59E0B',   // Orange
    high: '#F97316',     // Orange foncé
    overflow: '#EF4444', // Rouge
  };
  return colors[status];
}

export function getTrashBinLabel(status: TrashBinStatus): string {
  const labels = {
    empty: 'Vide',
    low: 'Peu rempli',
    medium: 'Moyen',
    high: 'Très rempli',
    overflow: 'Déborde !',
  };
  return labels[status];
}