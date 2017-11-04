import { generateUid } from 'utils'
import * as modules from './modules'
import scrollHub from './scroll-hub'

export default {
  install(Vue, options) {
    if (options) {
      Object.keys(modules).forEach(module => {
        if (modules[module].options) {
          modules[module].options(options)
        }
      })
    }

    Vue.directive('scroll', {
      bind(node, { arg, value, modifiers }) {
        if (!modules[arg] || !modules[arg].init) return;
        modules[arg].init({ uid: generateUid(), node, value, modifiers })
      },
      inserted(node, { arg, value, modifiers }) {
        let uid
        if (!modules[arg] || !modules[arg].add) return;
        uid = node.dataset.uid || generateUid()
        modules[arg].add({ uid, node, value, modifiers })
      },
      unbind(node, { arg }) {
        if (!modules[arg] || !modules[arg].remove) return;
        modules[arg].remove(node.dataset.uid)
      }
    })
  },

  triggerUpdate(delay = 0) {
    setTimeout(() => {
      scrollHub.triggerUpdate()
    }, delay)
  }
}
