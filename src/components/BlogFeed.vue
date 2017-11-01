<template>
  <transition-group tag="ul" class="blog__feed">
    <li v-for="post in feed" class="blog__post preview" :key="post.id">
      <figure class="preview__figure">
        <img :src="post.image"/>

        <figcaption class="preview__title ">
          {{ post.title }}
        </figcaption>
      </figure>

      <aside class="preview__details">
        <h5 class="preview__meta">
          <router-link :to="getAuthorLink(post.author)">by {{ post.author }}</router-link>
           —
          <time>{{ getElapsedTime(post.published) }} ago</time>
        </h5>
      </aside>
    </li>
  </transition-group>
</template>

<script>
export default {
  name: 'blog-feed',
  props: {
    author: String,
    posts: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    feed() {
      return (!this.author)
        ? this.posts
        : this.posts.filter(({ author }) => ~author.indexOf(this.author.replace('-', ' ')))
    }
  },

  methods: {
    getAuthorLink(name) {
      return `/by/${name.toLowerCase().replace(' ', '-')}`
    },
    getElapsedTime(since) {
      let minutes = (new Date() - new Date(since)) / 60000
      let elapsed = (minutes / 1440 > 365) ? [minutes / 525600 | 0, 'year']
        : (minutes >= 1440) ? [minutes / 1440 | 0, 'day']
        : (minutes >= 60) ? [minutes / 60 | 0, 'hour']
        : (minutes > 1) ? [minutes | 0, 'minute']
        : [1, 'minute']

      return elapsed.join(' ') + ((elapsed[0] > 1) ? 's' : '')
    }
  }
}
</script>
