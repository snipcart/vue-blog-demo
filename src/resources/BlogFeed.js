export default {
  feed() {
    return {
      path: '/feed.json',
      resolve: (response, mappers) => mappers.pipe(response.results)
    }
  }
}
