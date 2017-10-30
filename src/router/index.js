import Vue from 'vue'
import Router from 'vue-router'
import { Blog } from '../components'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'blog',
      component: Blog
    }
  ]
})
