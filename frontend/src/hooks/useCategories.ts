import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCKS) {
      import('../mocks/categories').then(({ mockCategories }) => {
        setCategories(mockCategories);
        setLoading(false);
      });
    } else {
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .then(({ data, error }) => {
          if (!error && data) {
            setCategories(data.map(c => ({
              id: c.id,
              name: c.name,
              icon: c.icon,
              color: c.color,
              isActive: c.is_active
            })));
          }
          setLoading(false);
        });
    }
  }, []);

  return { categories, loading };
}