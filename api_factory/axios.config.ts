import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from '@/composables/core/useCustomToast'


const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL || "http://localhost:3005/api";

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const getAdminToken = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )admin_token=([^;]+)'));
  if (!match || !match[2]) return null;
  let token = decodeURIComponent(match[2]);
  // Nuxt's useCookie JSON-serializes strings, wrapping them in quotes
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  return token;
};

const clearAdminToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'admin_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

GATEWAY_ENDPOINT.interceptors.request.use((config: any) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let lang = 'en';
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )i18n_redirected=([^;]+)'));
    if (match && match[2]) lang = decodeURIComponent(match[2]);
    else lang = localStorage.getItem('app-lang') || 'en';
  }
  config.headers['x-lang'] = lang;

  return config;
});

GATEWAY_ENDPOINT.interceptors.response.use(
  (response: CustomAxiosResponse) => response,
  (err: any) => {
    if (err.response?.status === 401) {
      clearAdminToken();
      const { showToast } = useCustomToast();
      showToast({ title: "Session Expired", message: "Please login again", toastType: "error" });
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);
