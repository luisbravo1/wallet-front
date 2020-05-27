import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#39AA44',
        secondary: '#84997a',
        accent: '#d5b562',
        error: '#b71c1c'
      }
    }
  }
})
