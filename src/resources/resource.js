import _merge from 'lodash.merge'

// install $resource as a Vue plugin
export default {
  install(Vue, { endpoint = '', resources = {} }) {
    // Add method to Vue prototype
    Vue.prototype.$getResource = function(method, options) {
      let name = this.$options.resource
      if (!name || !resources[name] || !resources[name][method]) return;

      // get fetch path and response resolver/mapper
      let { path, resolve } = resources[name][method](options)

      // methods return promise to keep chain alive
      const mappers = {
        // deep merge object with component $data
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

      // fetch and parse resource then pass to resolver
      return fetch(endpoint + path)
        .then(response => response.json())
        .then(response => resolve(response, mappers))
    }
  }
}
