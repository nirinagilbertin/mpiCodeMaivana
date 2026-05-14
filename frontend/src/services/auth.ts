import type { User } from "../types/user";
import { mockCurrentUser, mockAdminUser } from "../mocks/users";
import { USE_MOCKS } from "./api";
import apiClient from "./api";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Récupère l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<User> {
  if (USE_MOCKS) {
    return mockCurrentUser;
  }

  const response = await apiClient.get(ENDPOINTS.AUTH.ME);
  return response.data;
}

/**
 * Connexion utilisateur
 */
export async function login(
  email: string,
  password: string
): Promise<{ user: User; token?: string }> {
  if (USE_MOCKS) {
    const user = email.includes("admin") ? mockAdminUser : mockCurrentUser;
    return { user, token: "mock-token-12345" };
  }

  const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return { user: response.data };
}

/**
 * Inscription
 */

export async function register(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  neighborhood?: string;
}): Promise<{ user: User; token?: string }> {
  if (USE_MOCKS) {
    return {
      user: {
        id: 99,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: "citizen",
        isActive: true,
        neighborhood: data.neighborhood,
        createdAt: new Date().toISOString(),
      },
      token: "mock-token-12345",
    };
  }

  const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
  return { user: response.data };
}

/**
 * Déconnexion
 */

export function logout(): void {
  if (!USE_MOCKS) {
    apiClient
      .post(ENDPOINTS.AUTH.LOGOUT)
      .catch((error) => console.error("Erreur lors de la déconnexion :", error));
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}