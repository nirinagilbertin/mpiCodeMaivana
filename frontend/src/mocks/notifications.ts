import type { Notification } from "../types/notification";

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Nouvelle alerte",
    message: "Incendie signalé au marché Antsenakely. Tenez-vous informés.",
    isRead: false,
    type: "report_urgent",
    referenceId: 8,
    userId: 1,
    createdAt: "2026-05-14T09:45:00Z",
  },
  {
    id: 2,
    title: "Signalement résolu",
    message:
      "Votre signalement 'Panne éclairage public' a été marqué comme résolu.",
    isRead: true,
    type: "report_urgent",
    referenceId: 4,
    userId: 1,
    createdAt: "2026-05-13T11:00:00Z",
  },
  {
    id: 3,
    title: "Statut mis à jour",
    message: "Votre signalement 'Route endommagée' est maintenant en cours.",
    isRead: false,
    type: "report_urgent",
    referenceId: 3,
    userId: 1,
    createdAt: "2026-05-14T09:30:00Z",
  },
  {
    id: 4,
    title: "Alerte circulation",
    message:
      "Travaux RN7 Ambalapaiso. Circulation perturbée jusqu'à vendredi.",
    isRead: false,
    type: "post_alert",
    referenceId: 1,
    userId: 1,
    createdAt: "2026-05-14T06:00:00Z",
  },
  {
    id: 5,
    title: "Coupure d'eau",
    message: "Coupure d'eau en cours à Tanambao. Retour estimé à 14h.",
    isRead: true,
    type: "post_alert",
    referenceId: 3,
    userId: 1,
    createdAt: "2026-05-14T08:30:00Z",
  },
];