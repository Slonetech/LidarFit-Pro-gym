import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

type AuthStore = {
  token?: string;
};

const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const parsed: any = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
};

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try { localStorage.removeItem('auth'); } catch {}
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


