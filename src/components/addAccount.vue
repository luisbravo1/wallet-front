<template>
  <div>
    <v-container fluid>
      <v-card flat>
        <v-card-title>Add Account</v-card-title>
        <v-divider></v-divider>
        <v-form v-model="valid">
          <v-layout row wrap px-12 py-8>
            <v-flex xs8 pr-2>
              <v-text-field
                v-model="newAccount.name"
                label="Account Name"
                :rules="[() => newAccount.name.length > 1 || 'Give the account a larger name']"
                outlined
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pl-2>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="newAccount.color"
                    label="Color"
                    readonly
                    v-on="on"
                    outlined
                    required
                  ></v-text-field>
                </template>
                <v-color-picker v-model="newAccount.color"></v-color-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="newAccount.accountType"
                label="Account Type"
                :items="accountTypes"
                outlined
                required
              ></v-select>
            </v-flex>
            <v-flex xs6 pr-2>
              <v-text-field
                v-model="newAccount.startingAmount"
                label="Starting Amount"
                :rules="[() => newAccount.startingAmount >= 0 || 'Amount must be a positive number']"
                outlined
                type="number"
                prefix="$"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs6 pl-2>
              <v-select
                v-model="newAccount.currency"
                :items="currency"
                label="Currency"
                :rules="[() => newAccount.currency.length > 1 || 'Select a currency']"
                outlined
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 px-12 pb-4>
              <v-btn
                :disabled="!valid"
                :loading="isSending"
                color="primary"
                block
                @click="addAccount"
              >Add Account</v-btn>
              <center
                v-if="!isSending && success"
                class="pt-8 green--text"
              >Account Created!</center>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  components: {
  },
  data: () => ({
    user: '',
    dialog: true,
    valid: false,
    menu: false,
    isSending: false,
    success: false,
    currency: ['DLLS', 'MXN'],
    accountTypes: ['Cash', 'Debit Card', 'Credit Card', 'Savings'],
    newAccount: {
      name: '',
      color: '',
      accountType: '',
      startingAmount: 0,
      currency: ''
    }
  }),
  methods: {
    addAccount () {
      this.newAccount.balance = this.newAccount.startingAmount
      console.log(this.newAccount, this.valid)
      this.isSending = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.post('accounts', this.newAccount, options).then(response => {
        console.log('success')
        this.isSending = false
        this.success = true
      }, response => {
        console.log('error')
        this.isSending = false
        this.success = true
      })
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
.dotted {
  border: 2px dashed #cbcacc !important;
}
.records-amount {
  color: green;
  text-align: right;
}
</style>
