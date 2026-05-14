import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import type { ReportWithRelations } from "../types/report";
import { USE_MOCKS } from "../services/api";
import { mockReports } from "../mocks/reports";

interface SocketContextType {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string) => void;
  emit: (event: string, data?: unknown) => void;
  isConnected: boolean;
  newReports: ReportWithRelations[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { on, off, emit } = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [newReports, setNewReports] = useState<ReportWithRelations[]>([]);

  useEffect(() => {
    if (USE_MOCKS) {
      setIsConnected(true);

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

    return undefined;
  }, []);

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