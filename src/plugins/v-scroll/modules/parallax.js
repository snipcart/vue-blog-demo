import scrollHub from '../scroll-hub'

let defaults = {
  ratio: 0.25,
  offset: 0
}

export default {
  add({ uid, node, modifiers, value = {} }) {
    let { refNode = node.offsetParent, ratio = defaults.ratio, offset = defaults.offset } = value
    let prefix = (modifiers.horizontal) ? 'translate3d(' : 'translate3d(0, '
    let postfix = (modifiers.horizontal) ? 'px, 0, 0)' : 'px, 0)'
    let buffer, top
    ratio = ratio * -1

    if (value.transforms) prefix = `${value.transforms} ${prefix}`

    const updater = {
      requestUpdate() {
        top = refNode.getBoundingClientRect().top - offset
        if (!buffer) requestAnimationFrame(updater.updateNode)
        buffer = true
      },
      updateNode() {
        let pos = top * ratio
        node.style.transform = prefix + pos + postfix
        buffer = false
      }
    }

    updater.requestUpdate()
    node.dataset.uid = uid
    scrollHub.bind(uid, updater.requestUpdate)
  },
  remove(uid) {
    scrollHub.unbind(uid)
  },
  options({ parallax }) {
    if (!parallax) return;
    if (parallax.ratio) defaults.ratio = parallax.ratio
    if (parallax.offset) defaults.offset = parallax.offset
  }
}
