<template lang="pug">
  .coin-list
    .coin-list-header
      .container
        div(v-for="field in fields", :class="getHeaderClass(field)", :style="getFieldStyles(field)", @click="sortBy(field)")
          div {{ field.label }}

    .coin-list-body.scrollable
      .currency(v-for="currency in currencies")
        .container.hover
          div.field-wrapper(v-for="field in fields", :style="getFieldStyles(field)")
            div(:class="field.key", :style="field.contentStyles")
              slot(:name="field.key", :currency="currency", :value="currency[field.key]") {{ currency[field.key] }}
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: false
    },
    currencies: {
      type: Array,
      required: false
    }
  },
  data: () => ({
    styles: {
      width: '0',
      textAlign: 'center'
    },
    tooltipData: []
  }),
  computed: {
  },
  mounted () {
  },
  methods: {
    getFieldStyles (field) {
      return Object.assign({}, this.styles, field.styles)
    },

    getHeaderClass (field) {
      return `${field.key} ${field.sortable ? 'sortable' : ''} ${field.sortOrder || ''} ${field.headerLeft ? 'header-left' : ''}`
    },

    sortBy (field) {
      if (field.sortable) {
        field.sortOrder = field.sortOrder === 'asc' ? 'desc' : 'asc'

        this.fields.forEach((propField) => {
          propField.sortOrder = propField.key === field.key ? field.sortOrder : null
        })

        this.$emit('sortBy', field)
      }
    }

  }
}
</script>

<style scoped lang="scss">
  @import "../assets/variables.scss";

  .coin-list-header,
  .coin-list-icons,
  .coin-list-body {
    .container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      & > div {
        flex: 1 1 auto
      }
    }
  }

  .coin-list-header {
    background-color: $gray;
    padding: 10px 0;
    border-bottom: 1px solid $border-color;
    font-weight: bold;

    & > .container > div {
      display: flex;
      flex-direction: column-reverse;
    }

    .sortable {
      &.header-left > div {
        align-self: flex-start;
      }

      & > div {
        position: relative;
        cursor: pointer;
        padding-right: 10px;
        display: inline-block;
        align-self: center;
        max-width: 100%;

        &:before,
        &:after {
          position: absolute;
          right: 0;
          content: "";
          width: 8px;
          height: 8px;
          background-size: contain;
          background-repeat: no-repeat;
          transition: opacity 0.2s ease;
        }

        &:before {
          bottom: 8px;
          background-image: url("../assets/img/caret-up.svg");
        }

        &:after {
          bottom: 2px;
          background-image: url("../assets/img/caret-down.svg");
        }
      }

      &.asc {
        & > div:after {
          opacity: 0.3;
        }
      }

      &.desc {
        & > div:before {
          opacity: 0.3;
        }
      }
    }
  }

  .field-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-self: center;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }

  .currency .container {
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid $border-color;

    &.hover {
      cursor: pointer;

      &:hover {
        background: $light-gray;
      }
    }
  }

  .scrollable {
    position: relative;
  }
</style>
