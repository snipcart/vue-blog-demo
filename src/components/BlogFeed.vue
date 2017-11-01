<template>
  <transition-group tag="ul" class="blog__feed">
    <li v-for="post in feed" class="blog__post preview" :key="post.id">
      <router-link :to="`/read/${post.id}`">
        <figure class="preview__figure">
          <img :src="post.image"/>

          <figcaption class="preview__title ">
            <h4>{{ post.title }}</h4>
          </figcaption>
        </figure>
      </router-link>

      <aside class="preview__details">
        <h5 class="preview__meta">
          <router-link :to="getAuthorLink(post.author)">{{ post.author }}</router-link>
          <time class="preview__published">{{ getElapsedTime(post.published) }} ago</time>
        </h5>
      </aside>
    </li>
  </transition-group>
</template>

<script>
export default {
  name: 'blog-feed',
  resource: 'BlogFeed',
  props: { author: String },

  data() {
    return {
      posts: []
    }
  },

  computed: {
    feed() {
      const authors = ({ author }) => this.author === this.normalizeName(author)
      return (!this.author) ? this.posts : this.posts.filter(authors)
    }
  },

  methods: {
    normalizeName(name) {
      return name.toLowerCase().replace(' ', '-')
    },
    getAuthorLink(name) {
      return `/by/${this.normalizeName(name)}`
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
  },

  beforeMount() {
    this.$getResource('feed')
  }
}
</script>
