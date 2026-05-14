export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: "citizen" | "admin";
  isActive: boolean;
  avatarUrl?: string;
  neighborhood?: string;
  createdAt?: string;
  updatedAt?: string;
}