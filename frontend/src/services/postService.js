import api from './api';

export const postService = {
  getFeed: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  moderate: (id, approved) => api.put(`/posts/${id}/moderate`, { approved }),
  delete: (id) => api.delete(`/posts/${id}`),
  addComment: (postId, content) => api.post(`/posts/${postId}/comments`, { content }),
  deleteComment: (commentId) => api.delete(`/posts/comments/${commentId}`),
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
  getLikes: (postId, params) => api.get(`/posts/${postId}/likes`, { params }),
};