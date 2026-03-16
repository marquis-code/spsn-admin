import { ref, computed } from 'vue';

export const useUser = () => {
  const token = ref<string | null>(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const user = ref<any | null>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null);

  const isLoggedIn = computed(() => !!token.value);

  const setUser = (userData: any, userToken: string) => {
    user.value = userData;
    token.value = userToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
    }
  };

  const logOut = () => {
    user.value = null;
    token.value = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return { token, user, isLoggedIn, setUser, logOut };
};
