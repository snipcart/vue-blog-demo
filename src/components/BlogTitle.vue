<script>
import { unkebabify } from '../helpers'

export default {
  name: 'blog-title',
  props: ['blogName', 'filters'],

  data() {
    return {
      subTitle: ''
    }
  },

  computed: {
    title() {
      if (this.filters.post) return `${this.subTitle} - Blog`;
      if (this.filters.author) return `${this.subTitle} - Author`;
      return `Blog - ${this.blogName}`;
    }
  },

  methods: {
    setSubTitle(payload) {
      this.subTitle = unkebabify(payload)
    }
  },

  watch: {
    title () {
      document.title = this.title;
    },
    '$route.params' (params) {
      if (params.post) this.setSubTitle(params.post)
      if (params.author) this.setSubTitle(params.author)
    }
  },

  created () {
    document.title = this.title;
  },

  beforeMount() {
    let params = this.$route.params;
    if (params.post) this.setSubTitle(params.post)
    if (params.author) this.setSubTitle(params.author)
  },

  render() {
  }
}
</script>
