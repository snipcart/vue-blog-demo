<template>
  <transition name="post">
    <article v-if="post" class="post">
      <header class="post__header">
        <h2 class="post__title">{{ title }}</h2>

        <h3>by <router-link class="post__author"
          :to="`/by/${kebabify(author)}`">{{ author }}</router-link>
          <span class="post__dash">—</span>
          <time>{{ prettyDate(published) }}</time>
        </h3>
      </header>

      <section class="post__body rte">
        <blockquote class="post__subtitle">{{ description }}</blockquote>
        <div class="rte" v-html="content"></div>
      </section>

      <footer class="post__footer">
        <vue-disqus v-if="commentsReady" shortname="vue-blog-demo"
          :key="post" :identifier="post" :url="`https://vue-blog-demo.netlify.com/read/${post}`"/>
      </footer>
    </article>
  </transition>
</template>

<script>
import VueDisqus from 'vue-disqus/VueDisqus'
import { kebabify, prettyDate } from '../helpers'

export default {
  name: 'blog-post',
  resource: 'BlogPost',
  components: { VueDisqus },
  props: { post: String },

  data() {
    return {
      timer: 0,
      title: '',
      author: '',
      content: '',
      published: '',
      description: '',
      commentsReady: false
    }
  },

  watch: {
    post(to, from) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = 0
      }

      if (to === from || !this.post) return;

      this.commentsReady = false
      this.$getResource('post', to)
        .then(() => {
          this.showComments()
        })
    }
  },

  methods: {
    kebabify,
    prettyDate,
    showComments() {
      this.timer = setTimeout(() => {
        this.commentsReady = true
        this.timer = 0
      }, 1000)
    }
  },

  beforeMount() {
    if (!this.post) return;
    this.$getResource('post', this.post)
      .then(() => {
        this.showComments()
      })
  }
}
</script>
