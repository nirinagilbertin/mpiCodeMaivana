import { useState, useEffect } from "react";
import type { Category } from "../types/category";
import { getCategories } from "../services/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        setError("Erreur lors du chargement des catégories");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}