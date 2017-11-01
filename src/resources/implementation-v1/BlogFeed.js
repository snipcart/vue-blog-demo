export default {
  feed() {
    return {
      path: '/v1/feed.json',
      resolve: (response, mappers) => mappers.set({ posts: response.results })
    }
  }
}
