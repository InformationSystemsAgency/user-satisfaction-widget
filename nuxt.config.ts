// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  experimental: {
    scanPageMeta: true,
    payloadExtraction: true,
    sharedPrerenderData: true,
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@vueuse/motion/nuxt', '@nuxtjs/i18n', '@nuxt/fonts'],

  i18n: {
    locales: ['hy', 'en', 'ru'],
    defaultLocale: 'hy',
    detectBrowserLanguage: false,
    skipSettingLocaleOnNavigate: true,
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    families: [
      { name: 'Noto Sans Armenian', provider: 'google' },
      { name: 'Noto Sans', provider: 'google' },
      { name: 'Material Symbols Outlined', provider: 'googleicons' },
    ],
  },

  css: ['~/assets/css/main.css'],
});
