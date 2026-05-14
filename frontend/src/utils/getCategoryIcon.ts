const CATEGORY_ICONS: Record<string, string> = {
  eau: "💧",
  assainissement: "🚿",
  proprete: "🗑️",
  dechets: "♻️",
  securite: "🚨",
  urgence: "🆘",
  incendie: "🔥",
  accident: "🚑",
  route: "🛣️",
  transport: "🚌",
  circulation: "🚦",
  eclairage: "💡",
  electricite: "⚡",
  default: "📌",
};

/**
 * Retourne un emoji correspondant à une catégorie
 */
export function getCategoryIcon(categoryName?: string): string {
  if (!categoryName) return CATEGORY_ICONS.default;

  const normalized = categoryName.toLowerCase().trim();

  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (normalized.includes(key)) return icon;
  }

  return CATEGORY_ICONS.default;
}