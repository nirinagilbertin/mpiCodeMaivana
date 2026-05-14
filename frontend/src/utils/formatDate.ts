/**
 * Formate une date ISO en format lisible (fr-FR)
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return "Date inconnue";

  return new Date(isoString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Retourne un texte relatif ("il y a 5 min", "hier", etc.)
 */
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "";

  const now = Date.now();
  const date = new Date(isoString).getTime();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return formatDate(isoString);
}