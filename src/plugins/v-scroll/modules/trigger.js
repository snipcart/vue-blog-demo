import scrollHub from '../scroll-hub'

let nodes = {}
let defaults = {
  offset: 0,
  delay: 0
}

const update = () => {
  Object.keys(nodes).forEach(uid => {
    let trigger = nodes[uid]
    if (trigger.node.getBoundingClientRect().top < trigger.point) {
      setTimeout(() => {
        if (trigger.handler(trigger.node)) delete nodes[uid]
      }, trigger.delay)
    }
  })
}

scrollHub.bind('trigger', update)

export default {
  add({ uid, node, modifiers = {}, value = {} }) {
    let { offset = defaults.offset, delay = defaults.delay, handler } = value
    let base = (modifiers.top) ? 0 : window.innerHeight
    let point = (modifiers.top) ? base + offset : base - offset

    if (!handler) return;
    node.dataset.uid = uid
    nodes[uid] = { node, delay, point, handler }

    update()
  },
  remove(uid) {
    if (nodes[uid]) delete nodes[uid]
  },
  options({ trigger }) {
    if (!trigger) return;
    if (trigger.offset) defaults.offset = trigger.offset
    if (trigger.delay) defaults.delay = trigger.delay
  }
}
