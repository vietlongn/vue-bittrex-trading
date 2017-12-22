<template lang="pug">
  b-navbar.navbar-containter(toggleable="md", type="dark", variant="info")
    b-nav-toggle(target="nav_collapse")

    .container.header-container
      b-navbar-brand(tag="h1" class="mb-0")
        b-link.simple-text.navbar-brand(to="/")
          .logo-img
            img(src="../assets/img/logo.png")
          | Home

      b-collapse#nav_collapse(is-nav)
        b-navbar-nav
          //b-nav-item Second page
        b-navbar-nav.ml-auto
          b-nav-item-dropdown(right)
            template(slot="text") TuanCorn
            b-dropdown-item Logout
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  .navbar-containter {
    background-color: #005d50 !important;
    height: 120px;
  }

  .header-container {
    padding-bottom: 45px;
  }

  .simple-text {
    color: #FFFFFF;
    line-height: 40px;
  }

  .logo-img {
    width: 40px;
    display: inline-block;
    height: 40px;
    margin-right: 10px;
    background: white;
    border-radius: 40px;
    text-align: center;

    img {
      max-width: 21px;
    }
  }
</style>
