export default (() => {
  let store = {}

  return {
    has: uri => !!store[uri],
    get: uri => JSON.parse(store[uri]),
    set: (uri, data) => {
      store[uri] = JSON.stringify(data)
      return Promise.resolve(data)
    }
  }
})()
