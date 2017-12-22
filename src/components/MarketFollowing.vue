<template lang="pug">
  .market-following
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
      marketsFollowed: [],
      sort: {
        key: 'volumeChange',
        sortOrder: 'desc'
      }
    }),
    mounted () {
      EventBus.$emit('loading', true)
      this.fetchMarketFollowing()
      // setInterval(() => this.fetchCandleData(), this.timeInterval.oneMin)
    },
    methods: {
      async fetchMarketFollowing () {
        this.marketsFollowed = await this.$http.get('/markets/following')
          .then(({data}) => data)
          .catch(() => EventBus.$emit('loading', false))

        this.fetchData()
      },

      fetchData () {
        return this.$http.get('/markets-following', {params: {marketNames: this.marketsFollowed}})
          .then(({data}) => {
            let results = this.calculateChanges(data)

            if (this.sort.key) {
              this.dataSummaries = this.sortingData(results, this.sort)
            } else {
              this.dataSummaries = results
            }
          })
          .catch(() => EventBus.$emit('loading', false))
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
