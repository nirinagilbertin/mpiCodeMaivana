import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useSocketContext } from "./SocketContext";
import type { Notification } from "../types/notification";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  const { on } = useSocketContext();

  // Écoute les notifications en temps réel
  useEffect(() => {
    on("notification", () => {
      fetchNotifications();
    });

    return () => {
      // Le cleanup est géré par useSocket
    };
  }, [on, fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext doit être utilisé à l'intérieur d'un NotificationProvider"
    );
  }
  return context;
}