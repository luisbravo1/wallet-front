<template>
  <div>
    <!-- Accounts -->
    <v-layout row wrap justify-center style="background-color: #FFFFFF">
      <v-flex
        xs12 md3 pa-8
        v-for="(account, index) in accounts"
        :key="index"
      >
        <v-card
          :color="account.active ? account.color : '#c2c2c2'"
          class="mx-auto"
          outlined
          height="80"
          dark
          href="#"
          @click="account.active = !account.active"
        >
          <v-card-title class="flex-grow-1">{{ account.name }}</v-card-title>
          <v-card-subtitle class="flex-grow-1">${{ account.balance }} {{ account.currency }}</v-card-subtitle>
        </v-card>
      </v-flex>

      <!-- Add Account -->
      <v-flex xs12 md3 pa-8>
        <v-card
          color="#F4F5F4"
          class="mx-auto dotted"
          outlined
          height="80"
          href="#"
          @click="addAccountDialog = true"
        >
          <v-card-title class="flex-grow-1 align-center justify-center" style="color: grey">Add Account</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
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
              <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
      </v-layout>
      <!-- Dashboards -->
      <v-layout row wrap justify-space-around style="background-color: #f5f5f5">
        <!-- Pie Chart -->
        <v-flex xs12 md6 px-8 pt-2 pb-8>
          <v-card
            v-if="!isLoadingPie"
            class="mx-auto"
            outlined
          >
            <v-card-title class="flex-grow-1 align-center justify-center">Expenses Structure</v-card-title>
            <v-divider></v-divider>
            <div id="chart">
              <apexchart type="donut" height="262" :options="chartOptionsPie" :series="seriesPie"></apexchart>
            </div>
          </v-card>
        </v-flex>

        <!-- Line Chart -->
        <!-- <v-flex xs12 md4 px-8 pt-2 pb-8>
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title class="flex-grow-1 align-center justify-center">Balance Trend</v-card-title>
            <v-divider></v-divider>
            <div id="chart">
              <apexchart type="area" height="250" :options="chartOptions" :series="series"></apexchart>
            </div>
          </v-card>
        </v-flex> -->

        <!-- Radial Chart -->
        <v-flex xs12 md6 px-8 pt-2 pb-8>
          <v-card
            v-if="!isLoadingRadial"
            class="mx-auto"
            outlined
          >
            <v-card-title class="flex-grow-1 align-center justify-center">Cash Flow</v-card-title>
            <v-divider></v-divider>
            <div id="chart">
              <apexchart type="radialBar" height="250" :options="chartOptionsRadial" :series="seriesRadial"></apexchart>
            </div>
          </v-card>
        </v-flex>

        <!-- Last Records -->
        <v-flex xs12 md6 px-8 pt-2 pb-8>
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title class="flex-grow-1 align-center justify-center">Last Records</v-card-title>
            <v-divider></v-divider>
            <v-list two-line disabled>
              <v-list-item-group>
                <template v-for="(record, index) in records">
                  <v-list-item :key="record.id">
                    <v-list-item-avatar>
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
                    v-if="index + 1 < records.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-flex>

        <!-- Cash Flow -->
        <v-flex xs12 md6 px-8 pt-2 pb-8>
          <v-card
            class="mx-auto"
            outlined
            height="375"
          >
            <v-card-title class="flex-grow-1 align-center justify-center">Cash Flow</v-card-title>
            <v-divider></v-divider>
            <v-flex xs12 px-8 pt-4>
              <div class="subtitle-2">{{ dateRangeText }}</div>
              <div class="headline font-weight-bold">${{ balance }}</div>
            </v-flex>
            <v-flex px-8 py-4>
              <span>Income</span>
              <span style="float: right; padding-bottom: 6px">${{ income }}</span>
              <v-progress-linear
                v-model="incomePercent"
                color="green"
                height="30"
                rounded
              ></v-progress-linear>
            </v-flex>
            <v-flex px-8 py-4>
              <span>Expense</span>
              <span style="float: right; padding-bottom: 6px">- ${{ expense }}</span>
              <v-progress-linear
                v-model="expensePercent"
                color="red"
                height="30"
                rounded
              ></v-progress-linear>
            </v-flex>
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
import VueApexCharts from 'vue-apexcharts'
import addAccount from '../components/addAccount.vue'

export default {
  name: 'Dashboard',
  components: {
    apexchart: VueApexCharts,
    addAccount
  },
  data: () => ({
    date: ['2020-05-22', '2020-05-29'],
    menu: false,
    modal: false,
    income: 0,
    incomePercent: 0,
    expense: 0,
    expensePercent: 0,
    balance: 0,
    addAccountDialog: false,
    isLoadingPie: true,
    isLoadingRadial: true,
    accounts: [],
    series: [{
      name: 'Desktops',
      data: [10, 41, 35, 51, 49, -20, 69, 91, 148]
    }],
    chartOptions: {
      chart: {
        height: 250,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    },
    seriesPie: [0, 0, 0, 0, 0, 0, 0, 0],
    chartOptionsPie: {
      chart: {
        type: 'donut'
      },
      labels: ['Food & Drinks', 'Shopping', 'Housing', 'Transportation', 'Vehicle', 'Entertainment', 'Financial', 'Others'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    seriesRadial: [],
    chartOptionsRadial: {
      chart: {
        height: 350,
        type: 'radialBar',
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + '%'
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        }
      },
      stroke: {
        dashArray: 4
      },
      labels: ['Expense Ratio']
    },
    selected: [2],
    records: []
  }),
  computed: {
    dateRangeText () {
      return this.date.join(' ~ ')
    }
  },
  methods: {
    accountActive (account) {
      console.log(this.accounts)
      account.active = false
    },
    pieChartData (records) {
      records.forEach(record => {
        if (record.type === 'Expense') {
          console.log(record)
          switch (record.category) {
            case 'Food & Drinks':
              this.seriesPie[0] += (record.amount * -1)
              break
            case 'Shopping':
              this.seriesPie[1] += (record.amount * -1)
              break
            case 'Housing':
              this.seriesPie[2] += (record.amount * -1)
              break
            case 'Transportation':
              this.seriesPie[3] += (record.amount * -1)
              break
            case 'Vehicle':
              this.seriesPie[4] += (record.amount * -1)
              break
            case 'Entertainment':
              this.seriesPie[5] += (record.amount * -1)
              break
            case 'Financial':
              this.seriesPie[6] += (record.amount * -1)
              break
            case 'Others':
              this.seriesPie[7] += (record.amount * -1)
              break
          }
        }
      })
      this.isLoadingPie = false
    },
    cashFlowData (records) {
      records.forEach(record => {
        if (record.type === 'Expense') {
          this.expense += (record.amount * -1)
        } else {
          this.income += record.amount
        }
      })
      if (this.income > this.expense) {
        this.incomePercent = 100
        this.expensePercent = (this.expense * 100) / this.income
        this.seriesRadial[0] = Math.round(this.expensePercent)
      } else {
        this.incomePercent = (this.income * 100) / this.expense
        this.expensePercent = 100
        this.seriesRadial[0] = 100
      }
      this.balance = this.income - this.expense
      this.isLoadingRadial = false
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
        // console.log('success', response.data)
        this.isLoading = false
      }, response => {
        console.log('error')
        this.isLoading = false
      })
    },
    getRecords () {
      this.isLoading = true
      var options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.$cookies.get('authToken')
        }
      }
      this.$http.get('records/me/' + this.user.id, options).then(response => {
        if (response.data.length > 4) {
          for (let i = 0; i < 4; i++) {
            this.records.push(response.data[i])
          }
        } else {
          this.records = response.data
        }
        this.pieChartData(response.data)
        this.cashFlowData(response.data)
        // this.filteredRecords = response.data
        // this.dateRangeFilter()
        // console.log('success', response.data)
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
    this.getRecords()
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
