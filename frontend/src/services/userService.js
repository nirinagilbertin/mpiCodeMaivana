import api from './api';

export const userService = {
  register: (data) => api.post('/users/register', data),
  login: (email, password) => api.post('/users/login', { email, password }),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (oldPassword, newPassword) => api.put('/users/password', { oldPassword, newPassword }),
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};