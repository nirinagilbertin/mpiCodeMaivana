export interface Like {
  id: number;
  type: "like" | string;
  userId: number;
  postId: number;
}