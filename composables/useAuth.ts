import { computed } from 'vue'

export const useAuth = () => {
  const user = useCookie('admin_user', { path: '/' })
  const token = useCookie('admin_token', { path: '/' })

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
    return !!token.value
  })

  const hasPermission = (permissionKey: string) => {
    if (!user.value) return false
    if (user.value.role === 'super_admin') return true
    return user.value.permissions?.includes(permissionKey)
  }

  return {
    user,
    token,
    setUser,
    logout,
    isAuthenticated,
    hasPermission
  }
}
