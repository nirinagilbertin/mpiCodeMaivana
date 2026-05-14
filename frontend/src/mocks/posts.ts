import type { PostWithRelations } from "../types/post";
import { mockUsers } from "./users";
import { mockComments } from "./comments";

export const mockPosts: PostWithRelations[] = [
  {
    id: 1,
    content:
      "🚧 Attention : travaux de réparation sur la route RN7 au niveau d'Ambalapaiso. Circulation perturbée jusqu'à vendredi.",
    postType: "alert",
    latitude: -21.4456,
    longitude: 47.0801,
    isModerated: true,
    likesCount: 12,
    commentsCount: 3,
    userId: 4,
    createdAt: "2026-05-14T06:00:00Z",
    updatedAt: "2026-05-14T06:00:00Z",
    user: mockUsers[3],
    comments: [mockComments[0], mockComments[1]],
  },
  {
    id: 2,
    content:
      "La municipalité annonce l'ouverture d'un nouveau centre de tri des déchets à Andrainjato. ♻️ Une belle avancée pour la propreté de notre ville !",
    postType: "official",
    isModerated: true,
    likesCount: 24,
    commentsCount: 5,
    userId: 4,
    createdAt: "2026-05-13T14:00:00Z",
    updatedAt: "2026-05-13T14:00:00Z",
    user: mockUsers[3],
    comments: [],
  },
  {
    id: 3,
    content:
      "Coupure d'eau signalée dans le quartier de Tanambao. Les équipes sont sur place pour réparer la canalisation. Retour à la normale estimé à 14h.",
    postType: "alert",
    latitude: -21.4536,
    longitude: 47.0858,
    isModerated: true,
    likesCount: 8,
    commentsCount: 2,
    userId: 4,
    createdAt: "2026-05-14T08:30:00Z",
    updatedAt: "2026-05-14T08:30:00Z",
    user: mockUsers[3],
    comments: [mockComments[2]],
  },
  {
    id: 4,
    content:
      "🎉 Festival gastronomique ce weekend au parc Tsianolondroa ! Venez nombreux découvrir les spécialités locales.",
    postType: "event",
    latitude: -21.4512,
    longitude: 47.0889,
    isModerated: true,
    likesCount: 35,
    commentsCount: 8,
    userId: 2,
    createdAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
    user: mockUsers[1],
    comments: [],
  },
  {
    id: 5,
    content:
      "Quelqu'un sait si le marché d'Antsenakely est ouvert aujourd'hui ? J'ai entendu parler de l'incendie d'hier...",
    postType: "info",
    isModerated: true,
    likesCount: 3,
    commentsCount: 4,
    userId: 1,
    createdAt: "2026-05-14T09:00:00Z",
    updatedAt: "2026-05-14T09:00:00Z",
    user: mockUsers[0],
    comments: [mockComments[3]],
  },
];