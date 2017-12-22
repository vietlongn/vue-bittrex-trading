<template lang='pug'>
  #forecast-chart-by-day
</template>

<script>
  export default {
    name: 'forecast-chart-by-day',
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data: () => ({}),
    watch: {
      data () {
        this.drawForecastChartByDay(this.data)
      }
    },
    methods: {
      drawForecastChartByDay (data) {
        window.AmCharts.makeChart('forecast-chart-by-day', {
          'type': 'serial',
          'theme': 'light',
          'titles': [{
            'text': 'OVERVIEW DAILY IN 10 DAYS AGO',
            'size': 15,
            'color': '#173b5d',
            'bold': true
          }],
          'dataDateFormat': 'YYYY-MM-DD JJ:NN:SS',
          'valueAxes': [{
            'id': 'v1',
            'title': 'Volume (BTC)',
            'position': 'left',
            'autoGridCount': false,
            'axisAlpha': 1
          }, {
            'id': 'v2',
            'title': 'Close Price (BTC)',
            'position': 'right',
            'autoGridCount': false
            // 'synchronizeWith': 'v1',
            // 'synchronizationMultiplier': 0.2
          }],
          'graphs': [
            {
              'id': 'g1',
              'valueAxis': 'v1',
              'lineColor': '#2b9729',
              'negativeFillColors': '#a00405',
              'negativeLineColor': '#a00405',
              'fillAlphas': 0.8,
              'type': 'column',
              'title': 'Volume',
              'valueField': 'volume',
              'clustered': false,
              'columnWidth': 0.35,
              'balloonText': '[[title]]<br/>[[category]]</br><b style="font-size: 130%">[[value]] BTC</b>'
            }, {
              'id': 'g1',
              'valueAxis': 'v2',
              'bullet': 'square',
              'bulletBorderAlpha': 0.8,
              'bulletColor': '#FFFFFF',
              'bulletSize': 6,
              'hideBulletsCount': 50,
              'lineAlpha': 0.5,
              'lineThickness': 1.2,
              'lineColor': '#1d0109',
              'title': 'Close Price',
              'useLineColorForBulletBorder': true,
              'valueField': 'closePrice',
              'balloonText': '[[title]]</br><b style="font-size: 130%">[[value]]</b>'
            }],
          'chartCursor': {
            'pan': true,
            'valueLineEnabled': false,
            'valueLineBalloonEnabled': false,
            'cursorAlpha': 0,
            'valueLineAlpha': 0.2,
            'categoryBalloonDateFormat': 'YYYY-MM-DD'
          },
          'categoryField': 'date',
          'categoryAxis': {
            'parseDates': true,
            'dashLength': 3,
            'gridThickness': 0
          },
          'legend': {
            'useGraphSettings': true,
            'position': 'top'
          },
          'balloon': {
            'borderThickness': 1,
            'shadowAlpha': 0
          },
          'export': {
            enabled: false
          },
          'dataProvider': data
        })
      }

    }
  }
</script>

<style scoped lang='scss'>
  @import "../../assets/variables";

  #forecast-chart-by-day {
    max-width: 70%;
    height: 500px;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
