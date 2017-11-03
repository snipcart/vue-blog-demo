import Pace from 'pace-progress'

// pace progress bar
Pace.start()

// use pace hook to know when rendering is ready
Pace.once('hide', () => {
  window.prerenderReady = true
})

// Spektrum Media console message
console.info('%c', 'line-height:48px;padding:18px 150px;background:url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/vue-snip.svg\') center / contain no-repeat;')
