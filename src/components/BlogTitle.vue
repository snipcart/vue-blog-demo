<script>
export default {
  name: 'blog-title',
  props: ['title'],
  created () {
    document.title = this.title;
  },
  watch: {
    title () {
      document.title = this.title;
    }
  },
  render() {
  }
}
</script>
