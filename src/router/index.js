import Vue from 'vue'
import Router from 'vue-router'
import { Blog, BlogPost } from '../components'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'feed',
      component: Blog,
      children: [
        {
          path: '/by/:author',
          name: 'author',
          props: true,
          component: Blog
        },
        {
          path: '/read/:id',
          name: 'post',
          props: true,
          component: BlogPost
        }
      ]
    }
  ]
})
