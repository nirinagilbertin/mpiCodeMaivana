export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt?: string;
}