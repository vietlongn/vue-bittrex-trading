<template lang='pug'>
  .forecast-trend-chart
    svg.chart-area
      g.group-container(:transform="`translate(${margin.left*3}, ${margin.top})`")
        g.axis.axis-x(:transform="`translate(0, ${chartHeight})`")
        g.axis.axis-y
        g.axis.axis-center
        g.bar-group
          g(v-for="item in market")
            rect(
              :x="getBarXValue(item)",
              :y="getBarYValue(item)",
              width="4",
              :height="getRectHeight(item)",
              :fill="getBarColor(item)"
            )
        g.trend-line
          path(
            fill="none",
            stroke-width="1.5",
            stroke="black",
            :d="computeLine(market)"
          )
</template>

<script>
  import {
    line as d3Line,
    select,
    extent,
    axisBottom,
    axisLeft,
    axisTop,
    scaleLinear,
    scaleTime,
    timeParse, timeFormat
  } from '../../config/d3'

  export default {
    name: 'forecast-trend-chart',
    props: {
      market: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      svg: null,
      margin: {
        top: 50,
        right: 20,
        left: 70,
        bottom: 30
      }
    }),
    computed: {
      chartWidth () {
        return 960 - this.margin.left - this.margin.right
      },

      chartHeight () {
        return 500 - this.margin.bottom - this.margin.top
      },

      xValue () {
        return extent(this.market, d => this.parseDate(d.date))
      },

      yValue () {
        return extent(this.market, d => d.volume)
      },

      xScale () {
        return scaleTime().domain(this.xValue).range([0, this.chartWidth])
      },

      yScale () {
        return scaleLinear().domain(this.yValue).range([this.chartHeight, this.margin.top])
      },

      centerScale () {
        return scaleLinear().range([0, this.chartWidth])
      },

      computeLine () {
        return d3Line()
          .x(d => this.xScale(this.parseDate(d.date)))
          .y(d => this.yScale(d.change))
      },

      originPoint () {
        return this.yScale(0)
      }
    },
    watch: {
      market () {
        this.drawForecastTrend(this.market)
      }
    },
    mounted () {
      this.svg = select(this.$el).select('svg')
        .attr('width', this.chartWidth)
        .attr('height', this.chartHeight)
      this.groupContainer = this.svg.select('.group-container')
    },
    methods: {
      parseDate (date) {
        return timeParse('%Y-%m-%d %H:%M:%S')(date) // "2017-12-11 00:00:00"
      },

      drawForecastTrend (data) {
        this.svg.select('.axis-x')
          .call(axisBottom(this.xScale)
            .tickPadding(10)
            .tickFormat(d => this.xAxisTickFormat(d)))

        this.svg.select('.axis-y')
          .call(axisLeft(this.yScale).tickPadding(0))

        this.svg.select('.axis-center')
          .attr('transform', `translate(0, ${this.yScale(0)})`)
          .call(axisTop(this.centerScale).ticks(0))
      },

      getBarXValue (item) {
        return this.xScale(this.parseDate(item.date))
      },

      getBarYValue (item) {
        if (item.volume > 0) {
          return this.yScale(item.volume)
        } else {
          return this.yScale(0)
        }
      },

      getRectHeight (item) {
        return Math.abs(this.yScale(item.volume) - this.yScale(0))
      },

      getBarColor (item) {
        if (item.volume < 0) {
          return 'darkred'
        } else {
          return 'steelblue'
        }
      },

      xAxisTickFormat (value) {
        return timeFormat('%d-%b-%Y')(value)
      }

    }
  }
</script>

<style scoped lang='scss'>
  @import "../../assets/variables";

  .forecast-trend-chart {
    position: relative;
  }

  svg {
    width: 100%;
    height: 100%;
  }
</style>
