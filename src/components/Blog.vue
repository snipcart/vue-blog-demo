<template>
  <main class="blog">
    <nav-bar :title="title" :label="about.label"/>
    <blog-feed :posts="feed" :author="author"/>
    <router-view/>
  </main>
</template>

<script>
import NavBar from './NavBar'
import BlogFeed from './BlogFeed'

export default {
  name: 'blog',
  resource: 'Blog',
  components: { NavBar, BlogFeed },
  props: { author: String },

  data() {
    return {
      feed: [],
      title: '',
      about: {
        text: '',
        label: ''
      }
    }
  },

  beforeMount() {
    this.$getResource('blog')
    this.$getResource('feed')
  }
}
</script>
