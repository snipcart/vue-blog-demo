export default {
  feed() {
    return {
      path: '/v2/feed.json',
      resolve: (response, mappers) => {
        let collection = response.data.collection
        let posts = Object.keys(collection).map(id => ({
          id,
          ...collection[id].details,
          title: collection[id].content.title,
          description: collection[id].content.description,
          image: collection[id].content.image.url
        }))

        return mappers.set({ posts })
      }
    }
  }
}
