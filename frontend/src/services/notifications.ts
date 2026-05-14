import type { Notification } from "../types/notification";
import { mockNotifications } from "../mocks/notifications";
import { USE_MOCKS } from "./api";
import apiClient from "./api";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Récupère les notifications de l'utilisateur connecté
 */
export async function getNotifications(): Promise<Notification[]> {
  if (USE_MOCKS) {
    return [...mockNotifications].sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    );
  }

  const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.BASE);
  return response.data;
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(
  id: number
): Promise<Notification> {
  if (USE_MOCKS) {
    const notification = mockNotifications.find((n) => n.id === id);
    if (!notification) throw new Error("Notification non trouvée");
    notification.isRead = true;
    return notification;
  }

  const response = await apiClient.patch(
    ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
  );
  return response.data;
}

/**
 * Récupère le nombre de notifications non lues
 */
export async function getUnreadCount(): Promise<number> {
  if (USE_MOCKS) {
    return mockNotifications.filter((n) => !n.isRead).length;
  }

  const response = await apiClient.get(
    `${ENDPOINTS.NOTIFICATIONS.BASE}/unread-count`
  );
  return response.data.unreadCount;
}