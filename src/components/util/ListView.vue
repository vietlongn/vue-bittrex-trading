<template lang="pug">
  .market-container
    h2
    .detail-summary
      currency-list(:currencies="dataSummaries", :fields="fields", @sortBy="handleSortBehavior")
        template(slot="marketName", slot-scope="data")
          .market-name-detail(@click="handleClickOnMarket(data.currency)") {{ data.currency.marketName }}
        template(slot="volumeChange", slot-scope="data")
          volume-change(:currency="data.currency")
        template(slot="timeFrame", slot-scope="data")
          b-btn.time-frame-detail(v-b-popover.click.blur="handlePopover(data.currency)" variant="outline-success sm") Detail
    loading-spinner
</template>

<script>
  import EventBus from '@/event-bus'
  import CurrencyList from '../CurrencyList'
  import VolumeChange from '../VolumeChange'
  import LoadingSpinner from '../util/LoadingSpinner'

  export default {
    components: {
      LoadingSpinner,
      EventBus,
      CurrencyList,
      VolumeChange
    },
    props: {
      dataSummaries: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      sort: {
        key: '',
        sortOrder: ''
      },
      fields: [
        {
          key: 'marketName',
          label: 'Name',
          styles: {
            textAlign: 'left',
            width: '10%'
          }
        },
        {
          key: 'baseVolume',
          label: 'Base Volume',
          icon: 'base-volume',
          sortable: true
        },
        {
          key: 'volumeChange',
          label: 'Volume Change',
          icon: 'volume-change',
          sortable: true
        },
        {
          key: 'buyVolume',
          label: 'Buy Volume',
          icon: 'Buy-volume'
        },
        {
          key: 'sellVolume',
          label: 'Sell Volume',
          icon: 'sell-volume'
        },
        {
          key: 'timeFrame',
          label: 'Time Frame',
          icon: 'time-frame'
        }
      ]
    }),
    sockets: {
      connect: function () {
        console.log('Socket connected')
      },
      message: function (msg) {
        console.log('Client data', msg.length)
      }
    },
    methods: {
      handleSortBehavior (fields) {
        this.sort.key = fields.key
        this.sort.sortOrder = fields.sortOrder

        this.$emit('sortListView', fields)
        this.sortingData(this.dataSummaries, fields)
      },

      handleClickOnMarket (market) {
        this.$router.push({name: 'MarketDetail', params: {marketName: market.marketName}})
        // const marketDetailLink = this.$router.resolve({name: 'MarketDetail', params: {marketName: market.marketName}})
        // window.open(marketDetailLink.href, '_blank')
      },

      handlePopover (data) {
        return {
          html: true,
          title: `<b>${data.marketName}</b>`,
          content: () => {
            // Using table-striped class for table if needed
            if (data.priceChange) {
              let showData = `
          <div class="table-responsive">
            <table class="table popover-table .table-responsive">
              <tbody class="popover-tbl-body">
                <tr>
                  <th class="row-header">Time</th>`

              // Append time
              data.priceChange.forEach(item => {
                showData += `<td>${item.time}</td>`
              })

              showData += '</tr><tr><th class="row-header">Change</th>'

              // Append changes
              data.priceChange.forEach(item => {
                showData += `<td class="volume-change"><div class="${item.upDownClass}">${item.change}</div></td>`
              })

              showData += '</tr><tr><th class="row-header">Volume</th>'

              // Append volume
              data.priceChange.forEach(item => {
                showData += `<td> ${item.volume} </td>`
              })

              showData += '</tr></tbody></table></div>'

              return showData
            }
          }
        }
      }

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/variables.scss';

  h2 {
    background-color: $gray;
    padding: 20px 0;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: bold;
  }

  .detail-summary {
    min-height: calc(100vh - 234px);

    & /deep/ .spinner {
      top: auto;
      bottom: calc((100vh - 234px) / 2);
    }
  }
</style>
