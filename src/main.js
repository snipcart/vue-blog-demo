import './startup'

import Vue from 'vue'
import App from './App'
import router from './router'
import resource from './resources/resource'
import * as resources from './resources/v1'

Vue.config.productionTip = false

Vue.use(resource, {
  resources,
  endpoint: '/static/api'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
