// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_BASE_URL || 'https://spsn-backend.onrender.com'
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxt/icon', 'lucide-nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'fr', iso: 'fr-FR', name: 'Français' },
      { code: 'es', iso: 'es-ES', name: 'Español' },
      { code: 'pt', iso: 'pt-PT', name: 'Português' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  vite: {
    server: {
      hmr: {
        port: 24679
      }
    }
  },
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