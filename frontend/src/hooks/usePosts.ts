import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PostWithRelations } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function usePosts() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      if (USE_MOCKS) {
        const { mockPosts } = await import('../mocks/posts');
        setPosts(mockPosts as PostWithRelations[]);
      } else {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            user:users(*),
            report:reports(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data as PostWithRelations[]);
      }
    } catch (err) {
      console.error('Erreur posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (content: string, postType: string, userId: number) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        post_type: postType,
        user_id: userId
      })
      .select('*, user:users(*)')
      .single();

    if (error) throw error;
    setPosts(prev => [data as PostWithRelations, ...prev]);
    return data;
  };

  const likePost = async (postId: number, userId: number) => {
    await supabase.from('likes').insert({
      user_id: userId,
      post_id: postId
    });
    
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, likes_count: p.likesCount + 1 } : p
    ));
  };

  return { posts, loading, fetchPosts, createPost, likePost };
}