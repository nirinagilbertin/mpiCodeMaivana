export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  isOnDuty: boolean;       // true = en garde (vert), false = pas en garde (jaune)
  dutyStart?: string;      // "2026-05-15T20:00:00"
  dutyEnd?: string;        // "2026-05-16T08:00:00"
  createdBy?: string;      // ID de l'admin qui l'a ajoutée
  updatedAt?: string;
}