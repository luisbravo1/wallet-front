<template>
  <div>
    <v-container fluid pa-0>
      <v-card flat>
        <v-card-title>Add Record</v-card-title>
        <v-form v-model="valid">
          <v-layout row wrap px-2>
            <v-flex xs8 px-4>
              <v-layout row wrap px-12 :style="newRecord.type === 'Expense' ? 'background-color: #f54545' : 'background-color: #39AA44'">
                <v-flex offset-xs3 xs8 py-8 px-8>
                  <v-btn-toggle v-model="newRecord.type" mandatory>
                    <v-btn value="Expense">
                      <span>Expense</span>
                    </v-btn>
                    <v-btn value="Income">
                      <span>Income</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    v-model="newRecord.accountId"
                    :items="accounts"
                    :rules="[() => newRecord.accountId.length > 1 || 'Select an account']"
                    item-text="name"
                    item-value="id"
                    label="Account"
                    outlined
                    background-color="white"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs6 pr-2>
                  <v-text-field
                    v-model="newRecord.amount"
                    label="Amount"
                    :rules="[() => newRecord.amount > 0 || 'Amount must be bigger than 0']"
                    outlined
                    type="number"
                    prefix="$"
                    background-color="white"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 pl-2>
                  <v-select
                    v-model="newRecord.currency"
                    :items="accounts"
                    item-text="currency"
                    label="Currency"
                    :rules="[() => newRecord.currency.length > 1 || 'Select a currency']"
                    outlined
                    background-color="white"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap pa-8>
                <v-flex xs6 pr-2>
                  <v-select
                    v-model="newRecord.category"
                    :items="categories"
                    label="Category"
                    :rules="[() => newRecord.category.length > 1 || 'Select a category']"
                    outlined
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs6 pl-2>
                  <v-text-field
                    v-model="newRecord.labels"
                    label="Labels"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 pr-2>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="newRecord.date"
                        label="Date"
                        prepend-inner-icon="event"
                        outlined
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="newRecord.date" @input="menu = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 px-12 pb-4>
                  <v-btn
                    :disabled="!valid"
                    :loading="isSending"
                    color="primary"
                    block
                    @click="addRecord"
                  >Add Record</v-btn>
                  <center
                    v-if="!isSending && success"
                    class="pt-8 green--text"
                  >Record Added!</center>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs4 pl-2 pr-4 style="background-color: #F4F5F4">
              <v-layout row wrap pa-8>
                <v-flex xs12>
                  <v-textarea
                    v-model="newRecord.notes"
                    label="Notes"
                    outlined
                    background-color="white"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="newRecord.paymentType"
                    label="Payment Type"
                    outlined
                    background-color="white"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="newRecord.place"
                    label="Place"
                    outlined
                    background-color="white"
                  ></v-text-field>
                </v-flex>
              </v-layout>
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
    date: ['2020-05-22', '2020-05-29'],
    menu: false,
    modal: false,
    datePicker: false,
    dialog: true,
    valid: false,
    isSending: false,
    success: false,
    categories: ['Food & Drinks', 'Shopping', 'Housing', 'Transportation', 'Vehicle', 'Entertainment', 'Financial', 'Others'],
    accounts: [],
    newRecord: {
      accountId: '',
      type: 'Expense',
      amount: 0,
      currency: 'MXN',
      category: '',
      icon: '',
      color: '',
      date: new Date().toISOString().substr(0, 10),
      notes: '',
      place: '',
      paymentType: '',
      labels: []
    }
  }),
  computed: {
  },
  methods: {
    addRecord () {
      this.addCategory()
      if (this.newRecord.type === 'Expense') {
        this.newRecord.amount = this.newRecord.amount * -1
      }
      console.log(this.newRecord, this.valid)
      this.isSending = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.post('records', this.newRecord, options).then(response => {
        console.log('success')
        this.isSending = false
        this.success = true
      }, response => {
        console.log('error')
        this.isSending = false
        this.success = true
      })
    },
    addCategory () {
      switch (this.newRecord.category) {
        case 'Food & Drinks':
          this.newRecord.icon = 'restaurant'
          this.newRecord.color = '#e62305'
          break
        case 'Shopping':
          this.newRecord.icon = 'shopping_basket'
          this.newRecord.color = '#4ecbed'
          break
        case 'Housing':
          this.newRecord.icon = 'home'
          this.newRecord.color = '#edac4a'
          break
        case 'Transportation':
          this.newRecord.icon = 'directions_bus'
          this.newRecord.color = '#8f8d8b'
          break
        case 'Vehicle':
          this.newRecord.icon = 'directions_car'
          this.newRecord.color = '#b435de'
          break
        case 'Entertainment':
          this.newRecord.icon = 'local_activity'
          this.newRecord.color = '#41d944'
          break
        case 'Financial':
          this.newRecord.icon = 'account_balance'
          this.newRecord.color = '#edde39'
          break
        case 'Others':
          this.newRecord.icon = 'monetization_on'
          this.newRecord.color = '#b0b0b0'
          break
      }
    },
    getAccounts () {
      this.isLoading = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.get('accounts/me/' + this.user.id, options).then(response => {
        this.accounts = response.data
        console.log('success', response.data)
        this.isLoading = false
      }, response => {
        console.log('error')
        this.isLoading = false
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
    this.getAccounts()
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
