import { REPORT_STATUS } from "../config/constants";

type StatusKey = keyof typeof REPORT_STATUS;

export function getStatusColor(status: string): string {
  return REPORT_STATUS[status as StatusKey]?.color ?? "#6B7280";
}

export function getStatusLabel(status: string): string {
  return REPORT_STATUS[status as StatusKey]?.label ?? status;
}