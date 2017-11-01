export default (() => {
  let store = {}

  return {
    has: uri => !!store[uri],
    get: uri => store[uri],
    set: (uri, data) => {
      store[uri] = data
      return Promise.resolve(data)
    }
  }
})()
