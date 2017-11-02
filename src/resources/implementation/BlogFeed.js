export default {
  feed() {
    return {
      path: '/feed.json',
      resolve: (response, mappers) => mappers.set({ posts: response.results })
    }
  }
}
