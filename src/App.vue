<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      flat
    >
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        /> -->
        <v-btn
          class="custom-btn"
          icon
          @click="pushAndResetNav('/')"
        >
          <v-icon x-large>account_balance_wallet</v-icon>
        </v-btn>

        <v-btn
          text
          @click="pushAndResetNav('/')"
        >
          <v-toolbar-title>Wallet Online</v-toolbar-title>
        </v-btn>

        <v-btn
          v-for="link in links"
          :key="link.text"
          target="_blank"
          text
          @click="pushAndResetNav(link.to)"
        >
          <span class="mr-2">{{ link.text }}</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-menu bottom offset-y dark open-on-hover color="red">
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="user === null"
            dark
            text
            v-on="on"
            class="font-weight-regular"
          >
            Account
          </v-btn>
          <v-btn
            v-else
            dark
            text
            v-on="on"
            class="font-weight-regular"
          >
            <v-icon class="pr-2">person</v-icon>
            {{ user.name }}
          </v-btn>
        </template>

        <v-list v-if="user === null">
          <v-list-item @click="loginDialog = true">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list v-else>
          <!-- <v-list-item @click="pushAndResetNav('/account')">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item> -->
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

    <!-- Login -->
    <v-dialog v-model="loginDialog" max-width="500px">
      <v-card v-if="loginDialog">
        <Login></Login>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Login from './views/Login.vue'

export default {
  name: 'App',
  components: {
    Login
  },
  data: () => ({
    user: null,
    loginDialog: false,
    links: [
      {
        to: '/accounts',
        text: 'Accounts'
      },
      {
        to: '/records',
        text: 'Records'
      }
    ]
  }),
  methods: {
    pushAndResetNav (route) {
      if (this.$route.path !== route) {
        this.$router.push(route)
      }
    },
    logout () {
      localStorage.clear()
      this.$cookies.remove('authToken')
      this.$cookies.remove('shipping')
      this.$cookies.remove('cart')
      this.$router.push('/')
      this.$router.go(0)
    },
    getMe () {
      this.isSending = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.get('users/me', options).then(response => {
        window.localStorage.setItem('user', JSON.stringify(response.data))
        this.user = JSON.parse(window.localStorage.user)
      }, response => {
      })
    }
  },
  created () {
    if ('user' in window.localStorage) {
      this.user = JSON.parse(window.localStorage.user)
    } else {
      this.getMe()
    }
  }
}
</script>

<style scoped>
.custom-btn::before {
    color: transparent
}
.custom-btn:hover {
    color: red;
}
</style>
