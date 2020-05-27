<template>
  <div>
    <v-container fluid py-0>
      <!-- Date Picker -->
      <v-layout row wrap justify-center style="background-color: #f5f5f5">
        <v-flex xs2 pt-6>
          <v-select
            v-model="selectedSort"
            :items="sortBy"
            outlined
            background-color="white"
            label="Sort by"
          ></v-select>
        </v-flex>
      </v-layout>

      <v-layout row wrap justify-space-around style="background-color: #f5f5f5">
        <!-- Filters -->
        <v-flex xs12 md3 pl-12 pr-2 pt-2 pb-8>
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>Accounts</v-card-title>
            <div class="px-4 py-2">
              <v-btn
                color="primary"
                block
                depressed
                @click="addAccountDialog = true"
              >+ Add</v-btn>
            </div>
            <div class="px-4 pt-4">
              <v-text-field
                label="Search"
                prepend-inner-icon="search"
                outlined
                clearable
                dense
              >
              </v-text-field>
            </div>
          </v-card>
        </v-flex>
        <!-- Records -->
        <v-flex xs12 md9 pr-12 pl-2 pt-2 pb-8>
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>
              <v-flex>
                <span>Accounts</span>
              </v-flex>
              <v-flex style="text-align: right;">
                <span>${{ totalBalance }} MXN</span>
              </v-flex>
            </v-card-title>
            <v-divider></v-divider>
            <v-list v-if="accounts.length > 0" two-line flat>
              <v-list-item-group multiple>
                <template v-for="(account, index) in accounts">
                  <v-list-item :key="account.id">
                    <v-list-item-avatar class="mr-4">
                      <v-avatar :color="account.color">
                        <v-icon disabled dark>account_balance_wallet</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="account.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="account.accountType"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <span class="account-amount">${{ account.balance }} {{ account.currency }}</span>
                      <v-list-item-action-text v-text="account.date"></v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider
                    v-if="index + 1 < accounts.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            <center v-else class="pa-12">No accounts created</center>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- addAccount -->
    <v-dialog v-model="addAccountDialog" max-width="550px">
      <v-card v-if="addAccountDialog">
        <addAccount></addAccount>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import addAccount from '../components/addAccount.vue'

export default {
  name: 'Dashboard',
  components: {
    addAccount
  },
  data: () => ({
    user: '',
    date: ['2020-05-22', '2020-05-29'],
    addAccountDialog: false,
    menu: false,
    modal: false,
    income: 12098.44,
    expense: -6020.20,
    balance: 0,
    selectedRecords: [],
    selectedSort: 'Default',
    sortBy: ['Default', 'A-Z', 'Z-A', 'Balance (lowest first)', 'Balance (highest first)'],
    filters: [
      {
        name: 'ACCOUNTS',
        items: ['All Accounts', 'Cash', 'Debit Card', 'Dollars']
      },
      {
        name: 'CATEGORIES',
        items: ['All Categories', 'Food & Drinks', 'Shopping', 'Housing', 'Transportation', 'Vehicle']
      },
      {
        name: 'CURRENCIES',
        items: ['All Currencies', 'USD', 'MXN']
      },
      {
        name: 'RECORD TYPES',
        items: ['All Record Types', 'Income', 'Expense']
      },
      {
        name: 'PAYMENT TYPES',
        items: ['All Payment Types', 'Cash', 'Debit Card', 'Credit Card']
      },
      {
        name: 'AMOUNT RANGE'
      }
    ],
    accounts: [],
    records: [
      {
        id: '11',
        category: 'Energy',
        amount: '999.0',
        currency: 'MXN',
        type: 'Debit Card',
        date: '7/8/2020, 9:00 AM'
      },
      {
        id: '22',
        category: 'Energy',
        amount: '999.0',
        currency: 'MXN',
        type: 'Debit Card',
        date: '7/8/2020, 9:00 AM'
      },
      {
        id: '33',
        category: 'Energy',
        amount: '999.0',
        currency: 'MXN',
        type: 'Debit Card',
        date: '7/8/2020, 9:00 AM'
      },
      {
        id: '44',
        category: 'Energy',
        amount: '999.0',
        currency: 'MXN',
        type: 'Debit Card',
        date: '7/8/2020, 9:00 AM'
      }
    ]
  }),
  computed: {
    dateRangeText () {
      return this.date.join(' ~ ')
    },
    totalBalance () {
      var totalBalance = 0
      this.accounts.forEach(account => {
        totalBalance += account.balance
      })
      return totalBalance
    }
  },
  methods: {
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
.account-amount {
  color: green;
  text-align: right;
}
</style>
