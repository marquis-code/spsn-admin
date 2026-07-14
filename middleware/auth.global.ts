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

  // Permission checking
  if (isAuthenticated.value && (to.path.startsWith('/dashboard') || to.path.startsWith('/newsletters'))) {
    const { user, hasPermission } = useAuth()
    
    // Super admins can access everything
    if (user.value?.role === 'super_admin') return

    // Define route to permissionKey mapping
    const routePermissions: Record<string, string> = {
      '/dashboard/members': 'members',
      '/dashboard/enrollments': 'enrollments',
      '/dashboard/conferences': 'events',
      '/dashboard/abstracts': 'abstracts',
      '/dashboard/blogs': 'blogs',
      '/dashboard/appointments': 'appointments',
      '/dashboard/enquiries': 'enquiries',
      '/dashboard/chat': 'chat',
      '/dashboard/forms': 'forms',
      '/dashboard/payments': 'payments',
      '/dashboard/cms-website': 'cms-website',
      '/dashboard/cms-members': 'cms-members',
      '/dashboard/gallery': 'gallery',
      '/dashboard/adverts': 'adverts',
      '/dashboard/sponsors': 'sponsors',
      '/dashboard/digests': 'digests',
      '/dashboard/notifications': 'notifications',
      '/dashboard/campaigns': 'campaigns',
      '/newsletters': 'newsletters',
      '/dashboard/excos': 'excos',
      '/dashboard/admins': 'admins',
      '/dashboard/settings': 'settings'
    }

    // Check exact path match
    for (const [path, key] of Object.entries(routePermissions)) {
      if (to.path === path || to.path.startsWith(path + '/')) {
        if (key === 'admins') {
           // only super_admin can access admins, which we already checked above
           return navigateTo('/dashboard')
        }
        if (!hasPermission(key)) {
          return navigateTo('/dashboard')
        }
        break
      }
    }
  }
})
