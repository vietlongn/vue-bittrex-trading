<template lang="pug">
  .blanket(v-show="loading")
    rotate-square2.spinner
</template>

<script>
  import EventBus from '@/event-bus'
  import {RotateSquare2} from 'vue-loading-spinner'

  export default {
    components: {
      RotateSquare2
    },
    data: () => ({
      loading: false
    }),
    created () {
      EventBus.$on('loading', loading => {
        this.loading = loading
      })
    }
  }
</script>

<style scoped lang="scss">

  .blanket {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }

  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
