<template lang='pug'>
  #forecast-chart-by-hour
</template>

<script>
  export default {
    name: 'forecast-chart-by-hour',
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data: () => ({}),
    watch: {
      data () {
        this.drawForecastChartByHour(this.data)
      }
    },
    methods: {
      drawForecastChartByHour (data) {
        window.AmCharts.makeChart('forecast-chart-by-hour', {
          'type': 'serial',
          'theme': 'light',
          'titles': [{
            'text': 'OVERVIEW HOURLY IN 5 DAYS AGO',
            'size': 15,
            'color': '#173b5d',
            'bold': true
          }],
          'dataDateFormat': 'YYYY-MM-DD JJ:NN:SS',
          'precision': 2,
          'valueAxes': [{
            'id': 'v1',
            'title': 'Volume (BTC)',
            'position': 'left',
            'autoGridCount': false,
            'axisAlpha': 1
          }, {
            'id': 'v2',
            'title': 'Price Movement (%)',
            'position': 'right',
            'autoGridCount': false
            // 'synchronizeWith': 'v1',
            // 'synchronizationMultiplier': 0.2
          }],
          'graphs': [
            {
              'id': 'g4',
              'valueAxis': 'v1',
              'lineColor': '#2b9729',
              'negativeFillColors': '#a00405',
              'negativeLineColor': '#a00405',
              'fillAlphas': 0.5,
              'type': 'column',
              'title': 'Volume',
              'valueField': 'volume',
              'clustered': false,
              'columnWidth': 0.35,
              'balloonText': '[[title]]</br>[[category]]</br><b style="font-size: 130%">[[value]] BTC</b>'
            }, {
              'id': 'g1',
              'valueAxis': 'v2',
              'bullet': 'circle',
              'bulletBorderAlpha': 0.8,
              'bulletColor': '#FFFFFF',
              'bulletSize': 5,
              'hideBulletsCount': 50,
              'lineAlpha': 0.5,
              'lineThickness': 1.2,
              'lineColor': '#1d0109',
              'title': 'Price Movement',
              'useLineColorForBulletBorder': true,
              'valueField': 'change',
              'balloonText': '[[title]]</br><b style="font-size: 130%">[[value]]%</b>'
            }
          ],
          'chartScrollbar': {
            'graph': 'g1',
            'oppositeAxis': false,
            'offset': 30,
            'scrollbarHeight': 50,
            'backgroundAlpha': 0,
            'selectedBackgroundAlpha': 0.1,
            'selectedBackgroundColor': '#888888',
            'graphFillAlpha': 0,
            'graphLineAlpha': 0.5,
            'selectedGraphFillAlpha': 0,
            'selectedGraphLineAlpha': 1,
            'autoGridCount': true,
            'color': '#AAAAAA'
          },
          'chartCursor': {
            'pan': true,
            'valueLineEnabled': true,
            'valueLineBalloonEnabled': true,
            'cursorAlpha': 0,
            'valueLineAlpha': 0.2,
            'categoryBalloonDateFormat': 'YYYY-MM-DD JJ:NN:SS'
          },
          'categoryField': 'date',
          'categoryAxis': {
            'parseDates': true,
            'dashLength': 3,
            'gridThickness': 0,
            'minPeriod': 'hh',
            'minorGridEnabled': false,
            'startOnAxis': true
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

  #forecast-chart-by-hour {
    max-width: 70%;
    height: 500px;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
