import { useState, useEffect, useCallback } from "react";
import type { PostWithRelations } from "../types/post";
import type { Comment } from "../types/comment";
import { getPosts, createPost, addComment, toggleLike } from "../services/posts";

interface UsePostsOptions {
  postType?: string;
}

export function usePosts(options?: UsePostsOptions) {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(options);
      setPosts(data);
    } catch (err) {
      setError("Erreur lors du chargement des posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [options?.postType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (
    data: Parameters<typeof createPost>[0]
  ): Promise<PostWithRelations | null> => {
    try {
      const newPost = await createPost(data);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError("Erreur lors de la création du post");
      console.error(err);
      return null;
    }
  };

  const commentOnPost = async (
    postId: number,
    content: string
  ): Promise<Comment | null> => {
    try {
      const comment = await addComment(postId, content);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                commentsCount: p.commentsCount + 1,
                comments: p.comments
                  ? [...p.comments, comment]
                  : [comment],
              }
            : p
        )
      );
      return comment;
    } catch (err) {
      setError("Erreur lors de l'ajout du commentaire");
      console.error(err);
      return null;
    }
  };

  const likePost = async (
    postId: number
  ): Promise<{ liked: boolean; likesCount: number } | null> => {
    try {
      const result = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likesCount: result.likesCount } : p
        )
      );
      return result;
    } catch (err) {
      setError("Erreur lors du like");
      console.error(err);
      return null;
    }
  };

  return { posts, loading, error, fetchPosts, addPost, commentOnPost, likePost };
}