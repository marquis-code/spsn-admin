// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  modules: ['@nuxtjs/tailwindcss', 'lucide-nuxt', '@vueuse/nuxt'],
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
