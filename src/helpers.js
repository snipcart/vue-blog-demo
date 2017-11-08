import animateScroll from 'scrollto-with-animation'

export const scrollTo = (pos, duration = 600, delay = 0) => new Promise(resolve => {
  setTimeout(() => {
    animateScroll(document.documentElement, 'scrollTop', pos, duration, 'easeInOutSine', resolve)
  }, delay)
})

export const kebabify = (words) =>
  words
    .toLowerCase()
    .replace(' ', '-')

export const prettyDate = (date) =>
  new Date(date)
    .toString()
    .split(' ')
    .slice(0, 4)
    .join(' ')
    .replace(/( \d+)$/, ',$1')
