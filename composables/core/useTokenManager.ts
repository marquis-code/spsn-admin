import { ref } from 'vue';

export const useTokenManager = () => {
  const isRefreshing = ref(false);
  const isTokenRefreshing = () => isRefreshing.value;
  const queueFailedRequest = () => Promise.resolve(null);
  const refreshAccessToken = () => Promise.resolve(null);
  const clearTokens = () => {
    localStorage.removeItem('token');
  };
  return { isTokenRefreshing, queueFailedRequest, refreshAccessToken, clearTokens };
};
