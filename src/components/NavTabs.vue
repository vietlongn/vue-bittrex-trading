<template lang="pug">
  b-navbar.tabs-wrapper
    .container
      ul.nav.nav-tabs
        li.nav-item
          router-link.nav-link(:to="{name: 'MarketSummaries'}") Overview
        li.nav-item
          router-link.nav-link(:to="{name: 'MarketFollowing'}") List following
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
  @import "../assets/variables";

  .tabs-wrapper {
    padding-top: 0;
    padding-bottom: 0;
    margin-top: -34px;

    .container {
      margin-top: -1px;
      margin-bottom: -2px;

      .nav-tabs {
        .nav-item {
          margin-bottom: -2px;

          .nav-link {
            color: white;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;

            &.router-link-active, &.router-link-active:hover {
              color: #575756;
              border: 1px solid #f0f0f0;
              background-color: $gray;
            }

            &:hover {
              border-color: transparent;
            }
          }
        }
      }
    }
  }
</style>
