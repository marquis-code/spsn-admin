export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  if (to.path === '/') {
    return navigateTo(isAuthenticated.value ? '/dashboard' : '/login')
  }

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
