// Note: In a real monorepo this would be a shared package, 
// here we duplicate for simplicity as they are separate Nuxt projects.
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase || 'http://localhost:3001/api'

  const call = async (endpoint: string, options: any = {}) => {
    try {
      const response = await $fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
        }
      })
      return { data: response, error: null }
    } catch (err: any) {
      return { data: null, error: err.data || 'Something went wrong' }
    }
  }

  return {
    members: {
      getAll: () => call('/members'),
      getOne: (id: string) => call(`/members/${id}`),
      delete: (id: string) => call(`/members/${id}`, { method: 'DELETE' }),
    },
    blogs: {
      getAll: () => call('/blogs'),
      create: (data: any) => call('/blogs', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/blogs/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/blogs/${id}`, { method: 'DELETE' }),
    },
    appointments: {
      getAll: () => call('/appointments'),
      update: (id: string, data: any) => call(`/appointments/${id}`, { method: 'PATCH', body: data }),
    }
  }
}
