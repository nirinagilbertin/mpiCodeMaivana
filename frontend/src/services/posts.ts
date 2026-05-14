import type { PostWithRelations } from "../types/post";
import type { Comment } from "../types/comment";
import { mockPosts } from "../mocks/posts";
import { mockComments } from "../mocks/comments";
import { mockCurrentUser } from "../mocks/users";
import { USE_MOCKS } from "./api";
import apiClient from "./api";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Récupère tous les posts (fil d'actualité)
 */
export async function getPosts(
  filters?: {
    postType?: string;
  }
): Promise<PostWithRelations[]> {
  if (USE_MOCKS) {
    let filtered = [...mockPosts];

    if (filters?.postType) {
      filtered = filtered.filter((p) => p.postType === filters.postType);
    }

    // Tri par date décroissante
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    );

    return filtered;
  }

  const response = await apiClient.get(ENDPOINTS.POSTS.BASE, {
    params: filters,
  });
  return response.data;
}

/**
 * Crée un nouveau post
 */
export async function createPost(data: {
  content: string;
  postType: "info" | "alert" | "event" | "official";
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}): Promise<PostWithRelations> {
  if (USE_MOCKS) {
    const newPost: PostWithRelations = {
      id: mockPosts.length + 1,
      content: data.content,
      postType: data.postType,
      imageUrl: data.imageUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      isModerated: false,
      likesCount: 0,
      commentsCount: 0,
      userId: mockCurrentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: mockCurrentUser,
      comments: [],
    };
    mockPosts.unshift(newPost);
    return newPost;
  }

  const response = await apiClient.post(ENDPOINTS.POSTS.BASE, data);
  return response.data;
}

/**
 * Ajoute un commentaire à un post
 */
export async function addComment(
  postId: number,
  content: string
): Promise<Comment> {
  if (USE_MOCKS) {
    const newComment: Comment = {
      id: mockComments.length + 1,
      content,
      userId: mockCurrentUser.id,
      postId,
      createdAt: new Date().toISOString(),
    };
    mockComments.push(newComment);

    // Mettre à jour le compteur du post
    const post = mockPosts.find((p) => p.id === postId);
    if (post) post.commentsCount += 1;

    return newComment;
  }

  const response = await apiClient.post(ENDPOINTS.POSTS.COMMENTS(postId), {
    content,
  });
  return response.data;
}

/**
 * Like / Unlike un post
 */
export async function toggleLike(
  postId: number
): Promise<{ liked: boolean; likesCount: number }> {
  if (USE_MOCKS) {
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error("Post non trouvé");

    // Simulation : on alterne
    const liked = !post.likesCount || post.likesCount % 2 === 0;
    post.likesCount = liked ? post.likesCount + 1 : post.likesCount - 1;

    return { liked, likesCount: post.likesCount };
  }

  const response = await apiClient.post(ENDPOINTS.POSTS.LIKE(postId));
  return response.data;
}