export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useState('token', () => null)

  const login = async (credentials: any) => {
    // In a real app, this would call Firebase or your custom Auth endpoint
    // For now, we mock success
    user.value = { name: 'Admin User', role: 'SUPER_ADMIN' }
    token.value = 'mock-jwt-token'
    return { success: true }
  }

  const logout = () => {
    user.value = null
    token.value = null
    navigateTo('/login')
  }

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: computed(() => !!token.value)
  }
}
