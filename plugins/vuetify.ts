import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {colors} from "~/constants/colors";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: colors.primary,
            secondary: colors.secondary,
            background: colors.background,
            surface: colors.surface,
            error: colors.error,
            onPrimary: colors.onPrimary,
            onSecondary: colors.onSecondary,
            onBackground: colors.onBackground,
            onSurface: colors.onSurface,
            onError: colors.onError,
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})