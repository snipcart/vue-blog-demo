const matchMediaFallback = () => {
  let listeners = []
  let idle = true

  const device = (() => {
    let node = document.createElement('div')
    let style = document.createElement('style')

    node.id = 'match-media-node'
    style.innerHTML = `#match-media-node {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 100%;
      overflow: scroll;
    }`

    document.head.appendChild(style)
    document.body.insertBefore(node, document.body.children[0])

    return {
      get width() {
        return node.clientWidth
      },
      get height() {
        return node.clientHeight
      },
      get orientation() {
        return (node.clientHeight > node.clientWidth)
          ? 'portrait'
          : 'landscape'
      },
      get fontSize() {
        return window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('font-size')
      }
    }
  })()

  const createHandler = (feature, value) => {
    if (feature === 'orientation') {
      return () => value === device.orientation
    }

    let [prop, limit] = feature
      .split('-')
      .reverse()

    const operand = (!limit) ? '=='
      : (limit === 'min') ? '<'
      : '>'

    const parseValue = (() => {
      return (~value.indexOf('em'))
        ? () => parseFloat(value) * device.fontSize
        : () => parseFloat(value)
    })()

    const handlers = {
      'width': () => eval(parseValue() + operand + device.width),
      'height': () => eval(parseValue() + operand + device.height)
    }

    return handlers[prop]
  }

  const parseQuery = (queryString) => {
    let [feature, value] = queryString.replace(/[()\s]/g, '').split(':')
    return createHandler(feature, value)
  }

  window.addEventListener('resize', () => {
    if (!idle) return;
    idle = false

    let width = device.width
    let height = device.height

    let timer = setInterval(() => {
      if (width !== device.width || height !== device.height) {
        width = device.width
        height = device.height
      } else {
        clearTimeout(timer)
        listeners.forEach(handler => handler())
        idle = true
      }
    }, 100)
  })

  return (queryString) => {
    const query = parseQuery(queryString)
    const matcher = {
      get matches() {
        return query()
      }
    }

    return {
      ...matcher,
      addListener(cb) {
        const handler = () => cb(matcher)
        listeners.push(handler)
      }
    }
  }
}

const matchMedia = window.matchMedia || matchMediaFallback()

export { matchMedia as default }
