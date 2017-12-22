<template lang="pug">
  .market-summaries
    list-view(:dataSummaries="dataSummaries", @sortListView="handleSortListView")
</template>

<script>
  import EventBus from '@/event-bus'
  import ListView from './util/ListView'
  import LoadingSpinner from './util/LoadingSpinner'

  export default {
    components: {
      EventBus,
      ListView,
      LoadingSpinner
    },
    data: () => ({
      dataSummaries: [],
      sort: {
        key: 'volumeChange',
        sortOrder: 'desc'
      },
      timeInterval: {
        oneMin: 65000,
        fiveMin: 305000,
        thirtyMin: 1805000,
        oneHour: 3605000,
        day: 86405000
      }
    }),
    created () {
      this.fetchCandleData()
    },
    mounted () {
      EventBus.$emit('loading', true)
      setInterval(() => this.fetchCandleData(), this.timeInterval.oneMin)
    },
    methods: {
      fetchCandleData () {
        // EventBus.$emit('loading', true)
        return this.$http.get('/markets')
          .then(({data}) => {
            let results = this.calculateChanges(data)

            if (this.sort.key) {
              this.dataSummaries = this.sortingData(results, this.sort)
            } else {
              this.dataSummaries = results
            }
          })
          .finally(() => EventBus.$emit('loading', false))
      },

      handleSortListView (fields) {
        this.sort.key = fields.key
        this.sort.sortOrder = fields.sortOrder
      }

    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/variables.scss';

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
