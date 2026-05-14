import type { User } from "./user";
import type { Category } from "./category";

export interface Report {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  urgency: "low" | "medium" | "high" | "critical";
  status: "pending" | "validated" | "in_progress" | "resolved" | "rejected";
  photoUrl?: string;
  resolvedAt?: string;
  adminComment?: string;
  userId: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportWithRelations extends Report {
  user?: User;
  category?: Category;
}