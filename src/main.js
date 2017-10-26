import 'babel-polyfill'
import './startup'

import Vue from 'vue'
import App from './App'
import router from './router'
import globals from './components/globals'

Vue.config.productionTip = false

Vue.use(globals)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
