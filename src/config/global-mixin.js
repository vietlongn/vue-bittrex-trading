import Vue from 'vue'
import moment from 'moment'

Vue.mixin({
  data: () => ({
    changes: []
  }),
  methods: {
    round (x, maxDecimals = 0) {
      x = +x // Coerce x to a number if it isn’t already.
      x = x.toFixed(maxDecimals) // Format x as a string with maxDecimals decimal place.
      x = +x // Coerce x back to a number.

      return x
    },

    formatPercentage (value, maxDecimals = 0) {
      return `${(this.round(value, maxDecimals))}%`
    },

    calculateChanges (data) {
      return data.map(d => Object.assign({}, d, {
        priceChange: d.result.map(rs => ({
          time: moment(rs.T).format('H') + 'h',
          change: this.round(((rs.C - rs.O) / rs.O) * 100, 2) + '%',
          upDownClass: this.round(((rs.C - rs.O) / rs.O) * 100, 2) > 0 ? 'up' : 'down',
          volume: this.round(rs.BV, 2)
        })),
        sellVolume: this.calculateVolume(d.result, 'sell'),
        buyVolume: this.calculateVolume(d.result, 'buy'),
        volumeChange: this.calculateVolume(d.result, 'change')
      }))
    },

    calculateVolume (data, type) {
      let sellTotal = 0
      let buyTotal = 0

      data.forEach(rs => {
        if (rs.C < rs.O) {
          sellTotal += rs.BV
        } else {
          buyTotal += rs.BV
        }
      })

      switch (type) {
        case 'sell':
          return this.round(sellTotal, 2)
        case 'buy':
          return this.round(buyTotal, 2)
        default:
          let sellTotalFinal = sellTotal === 0 ? 1 : sellTotal
          return this.round(((buyTotal - sellTotal) / sellTotalFinal) * 100, 2)
      }
    },

    sortingData (data, sort) {
      return data.sort((current, next) => {
        if (sort.sortOrder.toString() === 'asc') {
          return current[sort.key] - next[sort.key]
        } else {
          return next[sort.key] - current[sort.key]
        }
      })
    }
  }
})
