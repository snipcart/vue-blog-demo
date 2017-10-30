<template>
  <main class="blog">
    <nav-bar :title="title" :label="about.label"/>
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
      feed: [],
      title: '',
      about: {
        text: '',
        label: ''
      }
    }
  }
}
</script>
