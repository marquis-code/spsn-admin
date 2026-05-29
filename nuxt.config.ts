// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_BASE_URL || 'https://spsn-backend.onrender.com'
    }
  },
  nitro: {
    devProxy: {
      '/socket.io': {
        target: 'http://localhost:3000/socket.io',
        ws: true
      }
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxt/icon'],
  build: {
    transpile: ['lucide-vue-next']
  },
  css: ['~/assets/font/stylesheet.css', '~/assets/css/main.css'],
  tailwindcss: {
    viewer: true,
  },
  app: {
    head: {
      title: 'SCPSN Admin Dashboard',
      meta: [
        { name: 'description', content: 'Administrative portal for Society for Cellular Pathology Scientists of Nigeria.' }
      ]
    }
  },
})
