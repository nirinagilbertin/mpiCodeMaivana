const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

/**
 * Initialise la connexion socket (désactivée côté frontend)
 */
export function initSocket(_token?: string): null {
  if (USE_MOCKS) {
    console.log("[Mock] Socket.io simulé - pas de connexion réelle");
  } else {
    console.log("[Socket] Socket.io désactivé côté frontend");
  }
  return null;
}

/**
 * Rejoint une room (no-op)
 */
export function joinRoom(_room: string): void {
  // Socket disabled in frontend for now
}

/**
 * Quitte une room (no-op)
 */
export function leaveRoom(_room: string): void {
  // Socket disabled in frontend for now
}

/**
 * Écoute un événement socket (no-op)
 */
export function onSocketEvent(
  _event: string,
  _callback: (...args: unknown[]) => void
): void {
  // Socket disabled in frontend for now
}

/**
 * Supprime l'écoute d'un événement (no-op)
 */
export function offSocketEvent(_event: string): void {
  // Socket disabled in frontend for now
}

/**
 * Déconnecte le socket (no-op)
 */
export function disconnectSocket(): void {
  // Socket disabled in frontend for now
}
