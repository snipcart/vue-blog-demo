<template>
  <article v-if="post" class="post">
    <header class="post__header">
      <h2 class="post__title">{{ title }}</h2>
    </header>

    <div class="post__body rte" v-html="content"></div>
  </article>
</template>

<script>
export default {
  name: 'blog-post',
  resource: 'BlogPost',
  props: { post: String },

  data() {
    return {
      title: '',
      content: '',
      author: '',
      published: ''
    }
  },

  watch: {
    post(to, from) {
      if (to !== from && this.post) this.$getResource('post', to)
    }
  },

  beforeMount() {
    if (this.post) this.$getResource('post', this.post)
  }
}
</script>
