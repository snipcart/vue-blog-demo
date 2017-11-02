export default {
  post(id) {
    return {
      path: `/v1/post/${id}.json`,
      resolve: (response, mappers) => {
        let { title, content } = response
        let { published, author } = response.meta
        content = '<p>' + content.split('\n\n').join('</p><p>') + '</p>'

        return mappers.merge({ title, content, author, published })
      }
    }
  }
}
