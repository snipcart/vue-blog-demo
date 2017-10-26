import Pace from 'pace-progress'

// pace progress bar
Pace.start()
// use pace hook to know when rendering is done
Pace.once('hide', () => {
  window.prerenderReady = true
})

// test localStorage
window.localStorageAvailable = (() => {
  try {
    localStorage.setItem('1', 0)
    localStorage.removeItem('1')
    return true
  } catch (e) {
    return false
  }
})()

// turn off chrome scroll restoration
// if (history.scrollRestoration) {
//   history.scrollRestoration = 'manual'
// }

// Spektrum Media console message
console.info('%c', 'line-height:24px;padding:12px 150px;background:url(\'https://www.spk.rocks/static/svg/production-spektrum.svg\') center / contain no-repeat;')
