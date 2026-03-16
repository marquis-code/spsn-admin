import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useTokenManager } from '@/composables/core/useTokenManager'

const { showToast } = useCustomToast();
const { token, logOut } = useUser();
const tokenManager = useTokenManager();

const $GATEWAY_ENDPOINT = process.env.VITE_BASE_URL || "http://localhost:3000/api";

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

GATEWAY_ENDPOINT.interceptors.request.use((config: any) => {
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }
  return config;
});

GATEWAY_ENDPOINT.interceptors.response.use(
  (response: CustomAxiosResponse) => response,
  (err: any) => {
    if (err.response?.status === 401) {
      logOut();
      showToast({ title: "Session Expired", message: "Please login again", toastType: "error" });
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
