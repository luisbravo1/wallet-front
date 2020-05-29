<template>
  <div>
    <v-container fluid py-0>
      <!-- Date Picker -->
      <v-layout row wrap justify-center style="background-color: #f5f5f5">
        <v-flex xs8 sm4 md2 pt-6>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateRangeText"
                prepend-inner-icon="event"
                background-color="white"
                readonly
                outlined
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date) | dateRangeFilter()">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
      </v-layout>

      <v-layout row wrap style="background-color: #f5f5f5">
        <!-- Filters -->
        <v-flex xs12 md3 :class="[windowSize < 2 ? 'px-8 py-4' : 'pl-12 pr-2 pt-2 pb-8']">
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>Records</v-card-title>
            <div class="px-4 py-2 pb-10">
              <v-btn
                color="primary"
                block
                depressed
                @click="addRecord()"
              >+ Add</v-btn>
            </div>
            <!-- <div class="px-4 pt-4">
              <v-text-field
                label="Search"
                prepend-inner-icon="search"
                outlined
                clearable
                dense
              >
              </v-text-field>
            </div> -->
            <v-divider></v-divider>
            <v-card-title>Filters</v-card-title>
            <div class="px-4 pb-8">
              <v-expansion-panels accordion flat multiple>
                <v-expansion-panel
                  v-for="(filter,i) in filters"
                  :key="i"
                >
                  <v-expansion-panel-header>{{ filter.name }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-checkbox
                      v-for="(item) in filter.items"
                      v-model="selectedFilters"
                      :value="item"
                      :key="item"
                      :label="item"
                      dense
                      hide-details
                      @change="filterRecords"
                    ></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card>
        </v-flex>
        <!-- Records -->
        <v-flex xs12 md9 :class="[windowSize < 2 ? 'px-8 py-4' : 'pr-12 pl-2 pt-2 pb-8']">
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>
              <v-flex>
                <span>Records</span>
              </v-flex>
              <v-flex style="text-align: right;">
                <span>${{ totalBalance }} MXN</span>
              </v-flex>
            </v-card-title>
            <v-divider></v-divider>
            <v-list v-if="records.length > 0" two-line flat>
              <v-list-item-group multiple>
                <template v-for="(record, index) in filteredRecords">
                  <v-list-item :key="record.id" @click="editRecord(record)">
                    <v-list-item-action>
                      <v-checkbox
                        v-model="selectedRecords"
                        :value="record"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar class="mr-4">
                      <v-avatar :color="record.color">
                        <v-icon dark>{{ record.icon }}</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="record.category"></v-list-item-title>
                      <v-list-item-subtitle v-text="record.type"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <span :class="[record.amount > 0 ? 'green--text' : 'red--text']">${{ record.amount }} {{ record.currency }}</span>
                      <v-list-item-action-text>{{ moment(record.date).add(5, 'hours').format('ll') }}</v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider
                    v-if="index + 1 < filteredRecords.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            <center v-else>No records found</center>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- addRecord -->
    <v-dialog v-model="addRecordDialog" max-width="850px">
      <v-card v-if="addRecordDialog">
        <addRecord :record="record"></addRecord>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import addRecord from '../components/addRecord.vue'
import moment from 'moment'

export default {
  name: 'Dashboard',
  components: {
    addRecord
  },
  data: () => ({
    date: ['2020-04-30', '2020-05-30'],
    addRecordDialog: false,
    menu: false,
    modal: false,
    income: 12098.44,
    expense: -6020.20,
    balance: 6400.20,
    record: null,
    selectedRecords: [],
    selectedFilters: [],
    filters: [
      {
        name: 'ACCOUNTS',
        items: []
      },
      {
        name: 'CATEGORIES',
        items: ['Food & Drinks', 'Shopping', 'Housing', 'Transportation', 'Vehicle', 'Entertainment', 'Financial', 'Others']
      },
      {
        name: 'RECORD TYPES',
        items: ['Income', 'Expense']
      },
      {
        name: 'PAYMENT TYPES',
        items: ['Cash', 'Debit Card', 'Credit Card']
      }
    ],
    accounts: [],
    records: [],
    filteredRecords: []
  }),
  computed: {
    dateRangeText () {
      return this.date.join(' ~ ')
    },
    totalBalance () {
      var totalBalance = 0
      this.records.forEach(record => {
        totalBalance += record.amount
      })
      return totalBalance
    },
    windowSize () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 0
        case 'sm': return 1
        case 'md': return 2
        case 'lg': return 3
        case 'xl': return 4
        default: return 0
      }
    }
  },
  methods: {
    addRecord () {
      this.record = null
      this.addRecordDialog = true
    },
    editRecord (record) {
      this.record = record
      this.addRecordDialog = true
    },
    setDate () {
      this.date[0] = moment().subtract(30, 'days').format('YYYY-MM-DD')
      this.date[1] = moment().format('YYYY-MM-DD')
    },
    dateRangeFilter () {
      var min = this.date[0]
      var max = this.date[1]
      if (this.date.length === 1) {
        max = min
      }
      if (this.date[0] > this.date[1]) {
        min = this.date[1]
        max = this.date[0]
      }
      this.filteredRecords = this.records.filter(record => {
        return record.date.substr(0, 10) >= min && record.date.substr(0, 10) <= max
      })
    },
    filterRecords () {
      if (this.selectedFilters.length < 1) {
        this.filteredRecords = this.records
        return
      }
      console.log('Filter', this.selectedFilters)
      this.filteredRecords = []
      this.records.forEach(record => {
        for (var [, value] of Object.entries(record)) {
          if (this.selectedFilters.includes(value)) {
            this.filteredRecords.push(record)
          }
        }
      })
    },
    // searchProducts () {
    //   this.categories[0].selected = []
    //   if (this.search === null) {
    //     this.resetProducts()
    //   } else {
    //     this.filteredProducts = []
    //     this.products.forEach(product => {
    //       if (product.name.toUpperCase().includes(this.search.toUpperCase())) {
    //         this.filteredProducts.push(product)
    //       }
    //     })
    //   }
    // },
    // resetProducts () {
    //   this.search = ''
    //   this.filteredProducts = this.products
    //   this.categories[0].selected = []
    // },
    getRecords () {
      this.isLoading = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.get('records/me/' + this.user.id, options).then(response => {
        this.records = response.data
        this.filteredRecords = response.data
        this.dateRangeFilter()
        console.log('success', response.data)
        this.isLoading = false
      }, response => {
        console.log('error')
        this.isLoading = false
      })
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
        if (response.data.length < 2) {
          this.filters[0].items.push(response.data[0].name)
        } else {
          response.data.forEach(account => {
            this.filters[0].items.push(account.name)
          })
        }
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
    this.getRecords()
    this.setDate()
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
