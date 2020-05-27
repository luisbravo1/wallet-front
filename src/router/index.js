import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Records from '../views/Records.vue'
import Accounts from '../views/Accounts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/records',
    name: 'Records',
    component: Records
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts
  }
]

const router = new VueRouter({
  routes
})

export default router
