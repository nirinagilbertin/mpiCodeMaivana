const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || "http://localhost:3000";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_URL}/users/login`,
    REGISTER: `${API_URL}/users/register`,
    ME: `${API_URL}/users/profile`,
    LOGOUT: `${API_URL}/users/logout`,
  },

  // Reports
  REPORTS: {
    BASE: `${API_URL}/reports`,
    BY_ID: (id: number) => `${API_URL}/reports/${id}`,
    STATS: `${API_URL}/reports/admin/statistics`,
    BY_CATEGORY: (categoryId: number) =>
      `${API_URL}/reports?categoryId=${categoryId}`,
  },

  // Posts
  POSTS: {
    BASE: `${API_URL}/posts`,
    BY_ID: (id: number) => `${API_URL}/posts/${id}`,
    COMMENTS: (postId: number) => `${API_URL}/posts/${postId}/comments`,
    LIKE: (postId: number) => `${API_URL}/posts/${postId}/like`,
  },

  // Categories
  CATEGORIES: `${API_URL}/categories`,

  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_URL}/notifications`,
    MARK_READ: (id: number) => `${API_URL}/notifications/${id}/read`,
  },

  // Socket
  SOCKET: SOCKET_URL,
} as const;