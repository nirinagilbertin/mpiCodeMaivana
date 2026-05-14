import type { Category } from "../types/category";
import { mockCategories } from "../mocks/categories";
import { USE_MOCKS } from "./api";
import apiClient from "./api";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Récupère toutes les catégories actives
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCKS) {
    return mockCategories.filter((c) => c.isActive);
  }

  const response = await apiClient.get(ENDPOINTS.CATEGORIES);
  return response.data;
}