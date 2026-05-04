import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from '@/composables/core/useCustomToast'


const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

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
  return match && match[2] ? decodeURIComponent(match[2]) : null;
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
