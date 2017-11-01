import Vue from 'vue'
import Router from 'vue-router'
import { Blog, BlogFeed, BlogPost } from '../components'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Blog,
      children: [
        {
          path: '',
          name: 'feed',
          component: BlogFeed
        },
        {
          path: '/by/:author',
          name: 'author',
          props: true,
          component: BlogFeed
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
