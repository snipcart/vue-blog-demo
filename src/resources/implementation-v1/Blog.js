export default {
  blog() {
    return {
      path: '/v1/blog.json',
      resolve: (response, mappers) => {
        let blog = response.results[0]

        return mappers.merge({
          title: blog.title,
          about: {
            text: blog.about_text,
            label: blog.about_label
          }
        })
      }
    }
  }
}
