import type { User } from "./user.js";
import type { Comment } from "./comment.js";
import type { Like } from "./like.js";

export interface Post {
  id: number;
  content: string;
  postType: "info" | "alert" | "event" | "official";
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  isModerated: boolean;
  likesCount: number;
  commentsCount: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostWithRelations extends Post {
  user?: User;
  comments?: Comment[];
  likes?: Like[];
}