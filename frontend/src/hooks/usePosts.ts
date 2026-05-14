import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { PostWithRelations } from "../types";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function usePosts() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 🔥 FIX #4 : suivi des posts likés par l'utilisateur courant
  const [userLikedPostIds, setUserLikedPostIds] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCKS) {
        const { mockPosts } = await import("../mocks/posts");
        setPosts(mockPosts as PostWithRelations[]);
      } else {
        const { data, error } = await supabase
          .from("posts")
          .select(`*, user:users(*), comments(*)`)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const mappedPosts = (data || []).map((item: any) => ({
          id: item.id,
          content: item.content,
          postType: item.post_type,
          imageUrl: item.image_url,
          latitude: item.latitude,
          longitude: item.longitude,
          isModerated: item.is_moderated,
          likesCount: item.likes_count || 0,
          commentsCount: item.comments_count || 0,
          userId: item.user_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          // 🔥 FIX #5 : inclure les commentaires dans le mapping
          comments: (item.comments || []).map((c: any) => ({
            id: c.id,
            content: c.content,
            userId: c.user_id,
            postId: c.post_id,
            createdAt: c.created_at,
          })),
          user: item.user
            ? {
                id: item.user.id,
                email: item.user.email,
                fullName: item.user.full_name,
                role: item.user.role,
                isActive: item.user.is_active,
                avatarUrl: item.user.avatar_url,
              }
            : undefined,
        }));

        setPosts(mappedPosts as PostWithRelations[]);

        // 🔥 FIX #4 : charger les likes de l'utilisateur courant
        if (user) {
          const { data: likesData } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id);

          if (likesData) {
            setUserLikedPostIds(new Set(likesData.map((l: any) => l.post_id)));
          }
        }
      }
    } catch (err) {
      console.error("Erreur posts:", err);
      setError("Impossible de charger les publications");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (content: string, postType: string) => {
    if (!user) throw new Error("Non connecté");

    const { data, error } = await supabase
      .from("posts")
      .insert({
        content,
        post_type: postType,
        user_id: user.id,
      })
      .select("*, user:users(*)")
      .single();

    if (error) throw error;

    const newPost: PostWithRelations = {
      id: data.id,
      content: data.content,
      postType: data.post_type,
      imageUrl: data.image_url,
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      userId: data.user_id,
      createdAt: data.created_at,
      isModerated: false,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.full_name,
            role: data.user.role,
            isActive: data.user.is_active,
          }
        : undefined,
    };

    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  // 🔥 FIX #2 : toggle like avec vérification doublon
  const likePost = async (postId: number) => {
    if (!user) throw new Error("Non connecté");

    const alreadyLiked = userLikedPostIds.has(postId);

    if (alreadyLiked) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      setUserLikedPostIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likesCount: Math.max(0, (p.likesCount || 0) - 1) } : p
        )
      );
    } else {
      // Like
      await supabase.from("likes").insert({ user_id: user.id, post_id: postId });

      setUserLikedPostIds((prev) => new Set(prev).add(postId));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p
        )
      );
    }
  };

  // 🔥 FIX #1 : fonction commentOnPost manquante
  const commentOnPost = async (postId: number, content: string) => {
    if (!user) throw new Error("Non connecté");

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, content })
      .select()
      .single();

    if (error) throw error;

    const newComment = {
      id: data.id,
      content: data.content,
      userId: data.user_id,
      postId: data.post_id,
      createdAt: data.created_at,
    };

    // Mettre à jour le post localement avec le nouveau commentaire
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: (p.commentsCount || 0) + 1,
              comments: [...(p.comments || []), newComment],
            }
          : p
      )
    );

    return newComment;
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    commentOnPost,
    userLikedPostIds,
  };
}