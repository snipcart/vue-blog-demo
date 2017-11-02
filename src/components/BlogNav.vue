<template>
  <nav class="nav">
    <h1 class="nav__title">
      <router-link to="/">{{ content.title }}</router-link>
    </h1>

    <transition-group tag="menu" name="nav__item">
      <li v-for="label in labels" class="nav__item" :key="label" @click="navBack">
        {{ label }}
      </li>
    </transition-group>
  </nav>
</template>

<script>
export default {
  name: 'blog-nav',
  props: {
    navs: Number,
    content: Object,
    filters: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    labels() {
      return Object.keys(this.filters)
        .map(filter => this.content.labels[filter])
    }
  },

  methods: {
    navBack() {
      if (this.navs) this.$router.go(-1)
      else this.$router.push('/')
    }
  }
}
</script>
