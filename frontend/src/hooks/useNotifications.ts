import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 🔥 Utilisateur connecté

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      if (USE_MOCKS) {
        const { mockNotifications } = await import('../mocks/notifications');
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n: Notification) => !n.isRead).length);
      } else {
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id) // 🔥 ID de l'utilisateur connecté
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Mapper snake_case → camelCase
        const mappedNotifications: Notification[] = (data || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          isRead: n.is_read,
          type: n.type,
          referenceId: n.reference_id,
          userId: n.user_id,
          createdAt: n.created_at,
        }));

        setNotifications(mappedNotifications);
        setUnreadCount(mappedNotifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Erreur notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    if (USE_MOCKS) {
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (USE_MOCKS) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      return;
    }

    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    refetch: fetchNotifications 
  };
}