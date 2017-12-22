<template lang="pug">
  #app
    app-header
    nav-tabs
    router-view
</template>

<script>
  import AppHeader from './components/Header'
  import NavTabs from './components/NavTabs'

  export default {
    name: 'app',
    components: {
      AppHeader,
      NavTabs
    },
    data: () => ({
    })
  }
</script>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap";
  @import "~bootstrap-vue/dist/bootstrap-vue";
  @import "./assets/variables";

  #app {
    font-family: 'Muli', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $text-color;
  }

  .popover {
    max-width: 60%;

    .popover-tbl-body {
      th {
        color: #007688;
      }

      padding-left: 3px;
      text-align: center;
    }
  }

  .volume-change div {
    font-weight: bold;

    &.down {
      color: $vol-down;
    }

    &.up {
      color: $vol-up;
    }
  }
</style>
