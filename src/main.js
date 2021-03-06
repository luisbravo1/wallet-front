import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'
import moment from 'moment'

Vue.use(VueResource)
Vue.use(VueCookies)

Vue.config.productionTip = false

// Vue.http.options.root = 'http://localhost:9000/'
Vue.http.options.root = 'https://wallet-back-dev.herokuapp.com/'
Vue.prototype.moment = moment

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
