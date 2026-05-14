import { io, Socket } from "socket.io-client";
import { ENDPOINTS } from "../config/endpoints";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

let socket: Socket | null = null;

/**
 * Initialise la connexion Socket.io
 */
export function initSocket(token?: string): Socket | null {
  if (USE_MOCKS) {
    console.log("[Mock] Socket.io simulé - pas de connexion réelle");
    return null;
  }

  if (socket?.connected) return socket;

  socket = io(ENDPOINTS.SOCKET, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connecté:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("[Socket] Déconnecté");
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Erreur de connexion:", error.message);
  });

  return socket;
}

/**
 * Retourne l'instance socket existante
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Rejoint une room (ex: quartier)
 */
export function joinRoom(room: string): void {
  if (USE_MOCKS) return;
  socket?.emit("join", room);
}

/**
 * Quitte une room
 */
export function leaveRoom(room: string): void {
  if (USE_MOCKS) return;
  socket?.emit("leave", room);
}

/**
 * Écoute un événement socket
 */
export function onSocketEvent(
  event: string,
  callback: (...args: unknown[]) => void
): void {
  if (USE_MOCKS) return;
  socket?.on(event, callback);
}

/**
 * Supprime l'écoute d'un événement
 */
export function offSocketEvent(event: string): void {
  if (USE_MOCKS) return;
  socket?.off(event);
}

/**
 * Déconnecte le socket
 */
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}