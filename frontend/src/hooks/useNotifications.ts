import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Notification } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useNotifications(userId?: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      if (USE_MOCKS) {
        const { mockNotifications } = await import('../mocks/notifications');
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n: Notification) => !n.isRead).length);
      } else {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          isRead: n.is_read,
          type: n.type,
          referenceId: n.reference_id,
          userId: n.user_id,
          createdAt: n.created_at
        })));
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Erreur notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id: number) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, loading, markAsRead, refetch: fetchNotifications };
}