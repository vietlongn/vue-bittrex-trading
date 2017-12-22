// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import AxiosPlugin from './config/axios'
// import VueSocketio from 'vue-socket.io'
import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'
import './config/global-mixin'

Vue.config.productionTip = false
Vue.use(AxiosPlugin)
Vue.use(AmCharts)
Vue.use(AmSerial)
Vue.use(BootstrapVue)
// Vue.use(VueSocketio, window.env.LOCATION) // Run deploy
// Vue.use(VueSocketio, 'http://localhost:8888') // Run local

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
