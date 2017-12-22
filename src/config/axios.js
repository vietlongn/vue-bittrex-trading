import axios from 'axios'

// axios.defaults.baseURL = window.env.API_ROOT
// axios.defaults.baseURL = 'http://localhost:9999/api'
axios.defaults.baseURL = '/api'

export default {
  install: (Vue) => {
    Object.defineProperty(Vue.prototype, '$http', {value: axios})
  }
}
