<template>
  <main class="blog">
    <blog-nav :content="content" :filters="filters" :navs="navs"/>
    <blog-feed :filters="filters"/>
    <blog-post :post="post"/>
  </main>
</template>

<script>
import BlogNav from './BlogNav'
import BlogFeed from './BlogFeed'
import BlogPost from './BlogPost'

export default {
  name: 'blog',
  components: { BlogNav, BlogFeed, BlogPost },
  resource: 'Blog',
  props: {
    post: String,
    author: String
  },

  data() {
    return {
      navs: 0,
      title: '',
      labels: {
        post: '',
        author: ''
      }
    }
  },

  computed: {
    content() {
      return { title: this.title, labels: this.labels }
    },
    filters() {
      let filters = {}

      if (this.post) filters.post = this.post
      if (this.author) filters.author = this.author

      return filters
    }
  },

  watch: {
    '$route.name' (to, from) {
      if (to !== from) this.navs++
    }
  },

  beforeMount() {
    this.$getResource('blog')
  }
}
</script>
