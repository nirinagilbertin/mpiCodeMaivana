import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // important pour les sessions HTTP
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globales (optionnel)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Non authentifié – on pourrait rediriger vers login
      console.warn('Session expirée ou non authentifié');
    }
    return Promise.reject(error);
  }
);

export default api;