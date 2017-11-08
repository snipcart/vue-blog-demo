import cache from './cache'
import _merge from 'lodash.merge'

// install $resource as a Vue plugin
export default {
  install(Vue, { endpoint = '', resources = {} }) {
    Vue.prototype.$getResource = function(method, options) {
      let name = this.$options.resource
      if (!name || !resources[name] || !resources[name][method]) return;

      // get fetch path and response resolver/mapper
      let { path, resolve } = resources[name][method](options)
      let uri = endpoint + path

      // methods return promise to allow chaining
      const mappers = {
        // only return promise without modifying instance $data
        pipe: dataSet => Promise.resolve(dataSet),

        // deep merge object with instance $data
        merge: dataSet => {
          _merge(this.$data, dataSet)
          return Promise.resolve(dataSet)
        },

        // set individual props on instance $data
        set: dataSet => {
          Object.keys(dataSet).forEach(prop => {
            this.$set(this.$data, prop, dataSet[prop])
          })

          return Promise.resolve(dataSet)
        }
      }

      // check to see if the resource has been cached already
      if (cache.has(uri)) return resolve(cache.get(uri), mappers)

      // fetch, parse and cache resource then pass to resolver
      return fetch(uri)
        .then(response => response.json())
        .then(response => cache.set(uri, response))
        .then(response => resolve(response, mappers))
    }
  }
}
