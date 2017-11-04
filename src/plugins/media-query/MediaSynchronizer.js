export class MediaSynchronizer {
  constructor(Vue, queries = {}) {
    let data = {}
    let mqLists, viewWidth, operands, buffer, watcher

    if (window.matchMedia) {
      // use more efficient MediaQueryListListeners if available
      mqLists = {}
      Object.keys(queries).forEach(media => {
        mqLists[media] = matchMedia(`(${queries[media]})`)
        data[media] = mqLists[media].matches

        mqLists[media].addListener(mq => {
          data[media] = mq.matches
        })
      })
    } else {
      // fallback to manual updates on resize event
      mqLists = []
      watcher = this.createWatcher()
      viewWidth = watcher.clientWidth
      operands = {
        max: '<',
        min: '>'
      }

      Object.keys(queries).forEach(media => {
        let [op, val] = queries[media].replace(/\s/g, '')
          // capture min/max and pixel value
          .match(/([^:-]+)(?:-[^:-]+)?:(\d+)/)
          // discard first array item
          .filter((r, index) => index)

        let query = operands[op] + val
        mqLists.push({ media, query })
        // use eval to transpile gt/lt operand
        data[media] = eval(viewWidth + query)
      })

      window.addEventListener('resize', () => {
        let ref = watcher.clientWidth
        buffer = true

        setTimeout(() => {
          // debounce and cancel pending updates
          if (watcher.clientWidth === ref && buffer) {
            buffer = false
            mqLists.forEach(({ media, query }) => {
              data[media] = eval(ref + query)
            })
          }
        }, 100)
      })
    }

    this.syncVM = new Vue({ data })
  }

  createWatcher() {
    let watcher = document.createElement('div')
    let style = document.createElement('style')

    style.innerHTML = `[data-vue-media-sync] {
      width: 100%;
      overflow: scroll;
      position: absolute;
      bottom: 100%;
    }`

    document.head.appendChild(style)
    watcher.setAttributeNode(document.createAttribute('data-vue-media-sync'))
    document.body.insertBefore(watcher, document.body.children[0])

    return watcher
  }

  get mediaQuery() {
    return this.syncVM.$data
  }
}
