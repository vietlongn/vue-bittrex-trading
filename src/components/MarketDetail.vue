<template lang="pug">
  #market-detail
    h2
      .container
        a(:href="`https://bittrex.com/Market/Index?MarketName=${marketName}`", target="_blank", style="color: #3572b0") {{ marketName }}
        .add-list
          img.list-icon.unfollowing(src="../assets/img/remove_list.svg", @click="unFollowMarket(marketName)", v-if="isFollowing")
          img.list-icon.following(src="../assets/img/add_list.svg", @click="followMarket(marketName)", v-else)
    .container.forecast-chart
      .row
        .col
          .view-title
            .switchers
              .switcher(:class="{selected: true}") Daily
              <!--.switcher Hourly-->
      forecast-chart-by-hour(:data="marketByHour")
      forecast-chart-by-day(:data="marketByDay")
    loading-spinner
</template>

<script>
  import EventBus from '@/event-bus'
  import LoadingSpinner from './util/LoadingSpinner'
  import ForecastChartByDay from './charts/ForecastChartByDay'
  import ForecastChartByHour from './charts/ForecastChartByHour'

  export default {
    components: {
      EventBus,
      LoadingSpinner,
      ForecastChartByDay,
      ForecastChartByHour
    },
    props: [
      'marketName'
    ],
    data: () => ({
      marketByHour: [],
      marketByDay: [],
      isFollowing: false
    }),
    computed: {
    },
    mounted () {
      EventBus.$emit('loading', true)
      this.fetchData()
    },
    methods: {
      async fetchData () {
        this.isFollowing = await this.$http.get(`/markets/${this.marketName}/following`)
          .then(({data}) => data)
          .catch(() => EventBus.$emit('loading', false))

        this.marketByHour = await this.$http.get(`/markets/${this.marketName}/hourly`)
          .then(({data}) => this.getDataByHour(this.adjustData(data)))
          .catch(() => EventBus.$emit('loading', false))

        this.marketByDay = await this.$http.get(`/markets/${this.marketName}/daily`)
          .then(({data}) => this.calculateChangeByDays(this.groupDataByDay(this.adjustData(data))))
          .catch(() => EventBus.$emit('loading', false))

        if (this.marketByHour.length > 0 && this.marketByDay.length > 0) {
          EventBus.$emit('loading', false)
        }
      },

      adjustData (data) {
        return data.map(d => Object.assign({}, {
          day: d.CurrentTime,
          valueOfDay: {
            closePrice: d.C,
            date: d.T,
            change: this.round(((d.C - d.O) / d.O) * 100, 2),
            volume: (() => {
              let volume = this.round(d.BV, 2)
              let changeVol = this.round(((d.C - d.O) / d.O) * 100, 2)

              return +(changeVol > 0 ? volume : `-${volume}`)
            })()
          }
        }))
      },

      getDataByHour (data) {
        return data.map(d => d.valueOfDay)
      },

      groupDataByDay (data) {
        let groupToValues = data.reduce((obj, item) => {
          obj[item.day] = obj[item.day] || []
          obj[item.day].push(item.valueOfDay)

          return obj
        }, {})

        return Object.keys(groupToValues).map(key => {
          return {date: key, value: groupToValues[key]}
        })
      },

      calculateChangeByDays (data) {
        return data.map(d => Object.assign({}, {
          date: d.date,
          closePrice: d.value.map(d => d.closePrice),
          volume: d.value.map(d => d.volume).reduce((total, volume) => total + volume)
        }))
      },

      followMarket (market) {
        this.$http.post(`/markets/${market}/following`)
          .then(({data}) => {
            this.isFollowing = (data === 200)
          })
      },

      unFollowMarket (market) {
        this.$http.delete(`/markets/${market}/following`)
          .then(({data}) => {
            this.isFollowing = !(data === 200)
          })
      }

    }

  }
</script>

<style lang="scss" scoped>
  @import "../assets/variables";

  h2 {
    background-color: $gray;
    padding: 30px 0;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: bold;
  }

  .add-list {
    cursor: pointer;
    float: right;
    margin-top: -10px;
    margin-right: 15px;

    .list-icon {
      width: 40px;
    }
  }

  .view-title {
    display: flex;
    align-items: baseline;
    flex-direction: row;
    text-transform: uppercase;
    border-bottom: 1px solid $btn-green;
    font-weight: bold;
  }

  .switchers {
    margin-left: auto;
    padding-right: 15px;

    .switcher {
      display: inline-block;
      padding: 5px 10px 1.5px;
      font-size: 16px;
      font-weight: normal;
      background: white;
      color: #005d50;
      margin-bottom: -1px;
      outline: none;

      &.selected {
        border: 1px solid $btn-green;
        font-weight: bold;
        pointer-events: none;
        border-bottom-color: transparent;
      }

      &:not(.selected):hover {
        color: white;
        border-top: 1px solid $btn-green;
        background-color: $btn-green;
      }
    }
  }

  .forecast-chart {
    padding-top: 20px;
  }
</style>
