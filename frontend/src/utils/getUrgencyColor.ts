import { URGENCY_LEVELS } from "../config/constants";

type UrgencyKey = keyof typeof URGENCY_LEVELS;

export function getUrgencyColor(urgency: string): string {
  return URGENCY_LEVELS[urgency as UrgencyKey]?.color ?? "#6B7280";
}

export function getUrgencyLabel(urgency: string): string {
  return URGENCY_LEVELS[urgency as UrgencyKey]?.label ?? urgency;
}