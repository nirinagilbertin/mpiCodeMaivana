import api from './api';

export const reportService = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  updateStatus: (id, status, adminComment) => api.put(`/reports/${id}/status`, { status, adminComment }),
  updateUrgency: (id, urgency) => api.put(`/reports/${id}/urgency`, { urgency }),
  delete: (id) => api.delete(`/reports/${id}`),
  getMapReports: (params) => api.get('/reports/map', { params }),
  getStatistics: () => api.get('/reports/admin/statistics'),
  getCriticalZones: () => api.get('/reports/admin/critical-zones'),
};
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};