<template>
  <transition-group tag="ul" class="blog__feed" name="preview">
    <li v-for="(post, index) in feed" :class="classes" :key="post.id">
      <router-link :to="`/read/${post.id}`">
        <figure class="preview__figure">
          <img :src="post.image"/>

          <transition name="fade">
            <figcaption v-if="!reading" class="preview__title">{{ post.title }}</figcaption>
          </transition>
        </figure>
      </router-link>

      <transition name="fade">
        <aside v-if="!reading" class="preview__details">
          <h5 class="preview__meta">
            <router-link class="preview__author"
              :to="`/by/${kebabify(post.author)}`"
              @click.native="scrollTo(0)">
              {{ post.author }}
            </router-link>

            <time class="preview__published">{{ prettyDate(post.published) }}</time>
          </h5>
        </aside>
      </transition>
    </li>
  </transition-group>
</template>

<script>
import { scrollTo, kebabify, prettyDate } from '../helpers'

export default {
  name: 'blog-feed',
  resource: 'BlogFeed',

  props: {
    filters: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      posts: []
    }
  },

  computed: {
    reading() { return this.filters.post },
    classes() {
      return {
        'preview': true,
        'blog__post': true,
        'preview--reading': this.reading
      }
    },
    feed() {
      const filterBy = {
        post: (filter, { id }) => filter === id,
        author: (filter, { author }) => filter === this.kebabify(author)
      }

      if (!Object.keys(this.filters).length) return this.posts

      return this.posts.filter(post => {
        return Object.keys(this.filters).every(filter => {
          return filterBy[filter](this.filters[filter], post)
        })
      })
    }
  },

  methods: {
    scrollTo,
    kebabify,
    prettyDate
  },

  beforeMount() {
    this.$getResource('feed')
  }
}
</script>
