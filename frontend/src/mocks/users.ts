import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    email: "jean.rakoto@email.com",
    fullName: "Jean Rakoto",
    phone: "034 12 345 67",
    role: "citizen",
    isActive: true,
    avatarUrl: "/images/mock/avatar-default.png",
    neighborhood: "Tanambao",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
  },
  {
    id: 2,
    email: "marie.rasoa@email.com",
    fullName: "Marie Rasoa",
    phone: "033 23 456 78",
    role: "citizen",
    isActive: true,
    avatarUrl: "/images/mock/avatar-default.png",
    neighborhood: "Anjoma",
    createdAt: "2025-02-10T09:30:00Z",
    updatedAt: "2025-05-28T14:00:00Z",
  },
  {
    id: 3,
    email: "pierre.rabe@email.com",
    fullName: "Pierre Rabe",
    role: "citizen",
    isActive: true,
    avatarUrl: "/images/mock/avatar-default.png",
    neighborhood: "Ambalapaiso",
    createdAt: "2025-03-05T11:00:00Z",
  },
  {
    id: 4,
    email: "admin@fianarapulse.mg",
    fullName: "Admin Fianara Pulse",
    phone: "034 00 000 00",
    role: "admin",
    isActive: true,
    avatarUrl: "/images/mock/avatar-default.png",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-06-14T08:00:00Z",
  },
];

export const mockCurrentUser: User = mockUsers[0];
export const mockAdminUser: User = mockUsers[3];