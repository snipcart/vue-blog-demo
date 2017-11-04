import scrollHub from '../scroll-hub'

let nodes = {}
let defaults = {
  offset: 0,
  delay: 0
}

const update = () => {
  Object.keys(nodes).forEach(uid => {
    let shift = nodes[uid]
    if (shift.node.getBoundingClientRect().top < shift.trigger) {
      setTimeout(() => {
        shift.node.classList.remove('v-shift')
        delete nodes[uid]
      }, shift.delay)
    }
  })
}

scrollHub.bind('shift', update)

export default {
  init({ uid, node }) {
    node.classList.add('v-shift')
    node.dataset.uid = uid
  },
  add({ uid, node, value = {} }) {
    let { offset = defaults.offset, delay = defaults.delay } = value
    let trigger = window.innerHeight - offset
    nodes[uid] = {
      node,
      delay,
      trigger
    }

    update()
  },
  remove(uid) {
    if (nodes[uid]) delete nodes[uid]
  },
  options({ shift }) {
    if (!shift) return;
    if (shift.offset) defaults.offset = shift.offset
    if (shift.delay) defaults.delay = shift.delay
  }
}
