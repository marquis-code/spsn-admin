import { computed } from 'vue'

export const useAuth = () => {
  const user = useCookie('admin_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })
  const token = useCookie('admin_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })

  const setUser = (userData: any, userToken: string) => {
    user.value = userData
    token.value = userToken
  }

  const logout = () => {
    user.value = null
    token.value = null
    // Add a small delay to ensure cookies are cleared before navigation
    return navigateTo('/login')
  }

  const isAuthenticated = computed(() => {
    // Check both the reactive token and the cookie directly if possible
    return !!token.value
  })

  return {
    user,
    token,
    setUser,
    logout,
    isAuthenticated
  }
}
