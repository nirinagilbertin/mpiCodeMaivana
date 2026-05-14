import type { Comment } from "../types/comment";

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "Merci pour l'info, je vais prendre un autre itinéraire.",
    userId: 1,
    postId: 1,
    createdAt: "2026-05-14T06:30:00Z",
  },
  {
    id: 2,
    content: "Les travaux avancent vite, c'est une bonne nouvelle !",
    userId: 2,
    postId: 1,
    createdAt: "2026-05-14T07:15:00Z",
  },
  {
    id: 3,
    content: "Merci de nous tenir informés. L'eau est déjà revenue chez moi.",
    userId: 1,
    postId: 3,
    createdAt: "2026-05-14T09:00:00Z",
  },
  {
    id: 4,
    content:
      "Oui le marché est ouvert, l'incendie a été maîtrisé rapidement heureusement.",
    userId: 2,
    postId: 5,
    createdAt: "2026-05-14T09:30:00Z",
  },
];