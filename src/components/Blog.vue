<template>
  <main class="blog">
    <nav-bar :title="title" :label="about.label"/>
    <router-view/>
  </main>
</template>

<script>
import NavBar from './NavBar'

export default {
  name: 'blog',
  resource: 'Blog',
  components: { NavBar },

  data() {
    return {
      title: '',
      about: {
        text: '',
        label: ''
      }
    }
  },

  beforeMount() {
    this.$getResource('blog')
  }
}
</script>
