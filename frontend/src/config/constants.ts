// Coordonnées centrées sur Fianarantsoa
export const MAP_CENTER = {
  lat: -21.4536,
  lng: 47.0858,
};

export const MAP_ZOOM_DEFAULT = 14;

// Statuts des signalements
export const REPORT_STATUS = {
  pending: { label: "En attente", color: "#F59E0B" },
  validated: { label: "Validé", color: "#3B82F6" },
  in_progress: { label: "En cours", color: "#8B5CF6" },
  resolved: { label: "Résolu", color: "#10B981" },
  rejected: { label: "Rejeté", color: "#EF4444" },
} as const;

// Niveaux d'urgence
export const URGENCY_LEVELS = {
  low: { label: "Faible", color: "#6B7280" },
  medium: { label: "Moyen", color: "#F59E0B" },
  high: { label: "Élevé", color: "#EF4444" },
  critical: { label: "Critique", color: "#7F1D1D" },
} as const;

// Types de posts
export const POST_TYPES = {
  info: { label: "Information", color: "#3B82F6" },
  alert: { label: "Alerte", color: "#EF4444" },
  event: { label: "Événement", color: "#10B981" },
  official: { label: "Officiel", color: "#8B5CF6" },
} as const;

// Quartiers de Fianarantsoa
export const NEIGHBORHOODS = [
  "Ambalapaiso",
  "Ambodiharana",
  "Andrainjato",
  "Anjoma",
  "Antsenakely",
  "Ivory",
  "Tanambao",
  "Tsianolondroa",
] as const;

// URLs des images mock
export const MOCK_IMAGES = {
  water: "https://images.unsplash.com/photo-1582719471384-2f949c71bf6f?w=600&h=400&fit=crop",
  trash: "https://images.unsplash.com/photo-1604187351574-c75ca9bf5b3e?w=600&h=400&fit=crop",
  road: "https://images.unsplash.com/photo-1515162816999-a0c47dc1927f?w=600&h=400&fit=crop",
  avatar: "https://ui-avatars.com/api/?name=Fianara+Pulse&background=3B82F6&color=fff&size=128",
} as const;