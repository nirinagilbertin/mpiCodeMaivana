import api from './api';

export const adminService = {
  // Dashboard
  getDashboardOverview: () => api.get('/dashboard/overview'),
  getReportsByCategory: () => api.get('/dashboard/reports-by-category'),
  getReportsEvolution: (days = 30) => api.get(`/dashboard/reports-evolution?days=${days}`),
  getTopNeighborhoods: () => api.get('/dashboard/top-neighborhoods'),
  getCriticalZones: () => api.get('/dashboard/critical-zones'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  generateReport: (period) => api.get(`/dashboard/report?period=${period}`),

  // Gestion utilisateurs (à adapter selon vos routes)
  getAllUsers: (params) => api.get('/users', { params }),
  updateUserStatus: (userId, isActive) => api.put(`/users/${userId}/status`, { isActive }),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
};