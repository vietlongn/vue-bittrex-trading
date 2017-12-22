<template lang="pug">
  .volume-change
    div(:class="[currency.volumeChange < 0 ? 'down' : 'up']") {{ currency.volumeChange }}%
</template>

<script>
  export default {
    props: {
      currency: {
        type: Object,
        required: true
      }
    }
  }
</script>
