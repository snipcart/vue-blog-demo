import Vue from 'vue'

class ScrollHub {
  constructor() {
    this.listeners = {}
    this.eventHub = new Vue({
      data() {
        return {
          scroll: 0,
          buffer: false
        }
      },
      methods: {
        increment() {
          this.scroll += 1
          this.buffer = false
        }
      }
    })

    window.addEventListener('scroll', () => {
      if (!this.eventHub.buffer) requestAnimationFrame(this.eventHub.increment)
      this.eventHub.buffer = true
    })
  }

  bind(uid, handler) {
    this.listeners[uid] = {
      unbind: this.eventHub.$watch('scroll', handler, { immediate: true })
    }
  }

  unbind(uid) {
    if (this.listeners[uid]) {
      this.listeners[uid].unbind()
    }
  }

  triggerUpdate() {
    this.eventHub.increment()
  }
}

export default new ScrollHub()
