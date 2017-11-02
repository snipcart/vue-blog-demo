export default {
  blog() {
    return {
      path: '/v2/blog.json',
      resolve: (response, mappers) => {
        let blog = response.data.blog

        return mappers.merge({
          title: blog.title,
          labels: blog.labels
        })
      }
    }
  }
}
