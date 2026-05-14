import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAuthContext } from "./AuthContext";
import type { ReportWithRelations } from "../types/report";
import { USE_MOCKS } from "../services/api";
import { mockReports } from "../mocks/reports";

interface SocketContextType {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string) => void;
  emit: (event: string, data?: unknown) => void;
  isConnected: boolean;
  // Événements simulés en mode mock
  newReports: ReportWithRelations[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { on, off, emit } = useSocket(user ? "mock-token" : undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [newReports, setNewReports] = useState<ReportWithRelations[]>([]);

  useEffect(() => {
    if (USE_MOCKS) {
      // Simule la connexion
      setIsConnected(true);

      // Simule l'arrivée de nouveaux signalements toutes les 45 secondes
      const interval = setInterval(() => {
        const randomReport = mockReports[Math.floor(Math.random() * mockReports.length)];
        if (randomReport) {
          const simulatedReport: ReportWithRelations = {
            ...randomReport,
            id: Date.now(),
            title: `[Temps réel] ${randomReport.title}`,
            createdAt: new Date().toISOString(),
            status: "pending",
          };
          setNewReports((prev) => [simulatedReport, ...prev].slice(0, 5));
        }
      }, 45000);

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    }

    // En mode réel, écoute les événements socket
    on("connect", () => setIsConnected(true));
    on("disconnect", () => setIsConnected(false));
    on("new-report", (data: unknown) => {
      const report = data as ReportWithRelations;
      setNewReports((prev) => [report, ...prev].slice(0, 10));
    });

    return () => {
      off("connect");
      off("disconnect");
      off("new-report");
    };
  }, [on, off]);

  const value: SocketContextType = {
    on,
    off,
    emit,
    isConnected,
    newReports,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocketContext(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext doit être utilisé à l'intérieur d'un SocketProvider"
    );
  }
  return context;
}