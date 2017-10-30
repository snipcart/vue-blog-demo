import _merge from 'lodash.merge'

export default {
  install(Vue, { endpoint, resources = {} }) {
    if (!endpoint) return;

    Vue.prototype.$resource = function(method, options) {
      let name = this.$options.resource
      if (!name || !resources[name] || !resources[name][method]) return;

      let source = resources[name][method].call(this, options)

      fetch(endpoint + source.fetch)
        .then(response => response.json())
        .then(data => {
          _merge(this.$data, source.resolve(data, options))
        })
    }

    Vue.mixin({
      beforeMount() {
        let name = this.$options.resource
        if (!name || !resources[name] || !resources[name].fetch) return;

        let sources = resources[name].fetch.call(this)

        Object.keys(sources).forEach(map => {
          fetch(endpoint + map)
            .then(response => response.json())
            .then(data => {
              _merge(this.$data, sources[map](data))
            })
        })
      }
    })
  }
}
