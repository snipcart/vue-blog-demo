import scrollHub from '../scroll-hub'

let nodes = {}

const update = () => {
  Object.keys(nodes).forEach(uid => {
    let bound = nodes[uid]
    if (bound.handler(bound.node)) delete nodes[uid]
  })
}

scrollHub.bind('bind', update)

export default {
  add({ uid, node, value: handler }) {
    if (!handler) return;
    node.dataset.uid = uid
    nodes[uid] = { node, handler }
  },
  remove(uid) {
    if (nodes[uid]) delete nodes[uid]
  }
}
