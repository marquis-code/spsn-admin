export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // Pages that do NOT require authentication
  const publicPages = ['/login', '/verify-2fa', '/forgot-password', '/reset-password']
  const isPublicPage = publicPages.includes(to.path)

  if (to.path === '/') {
    return navigateTo(isAuthenticated.value ? '/dashboard' : '/login')
  }

  if (!isAuthenticated.value && !isPublicPage) {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && isPublicPage) {
    return navigateTo('/dashboard')
  }
})
