export default {
  fetch() {
    return {
      '/v1/feed.json': response => ({ feed: response.results }),
      '/v1/blog.json': response => {
        let blog = response.results[0]

        return {
          title: blog.title,
          about: {
            text: blog.about_text,
            label: blog.about_label
          }
        }
      }
    }
  }
}
