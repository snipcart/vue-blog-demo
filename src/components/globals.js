/* Example usage **
import * as helpers from './helpers'
import * as content from './layouts/shared/content'
const globals = { ...helpers, ...content }
**/

const globals = {}
const components = Object.keys(globals).map(component => globals[component])

export default {
  install(Vue) {
    components.forEach(global => {
      Vue.component(global.name, global)
    })
  }
}
