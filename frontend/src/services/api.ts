import axios from "axios";

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
      readonly VITE_USE_MOCKS?: string;
    };
  }
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour simuler la latence en mode mock
apiClient.interceptors.request.use(async (config) => {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return config;
});

// Intercepteur pour normaliser la réponse backend
apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === "object" && "data" in payload) {
      return { ...response, data: payload.data };
    }
    return response;
  },
  (error) => {
    if (!USE_MOCKS) {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export { USE_MOCKS };
export default apiClient;