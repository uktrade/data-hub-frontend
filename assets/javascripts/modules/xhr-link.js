const queryString = require('query-string')
const XHR = require('../lib/xhr')

const XhrLink = {
  selector: '.js-xhr',

  init (isGlobal = false) {
    this.isGlobal = isGlobal
    document.addEventListener('click', this.handleClick.bind(this))
  },

  handleClick (evt) {
    const target = evt.target || evt.srcElement
    const url = target.getAttribute('href')
    const hasXhrClass = target.classList.contains(this.selector.substring(1))
    const shouldXhr = target.tagName === 'A' && this.isGlobal ? true : hasXhrClass

    if (!url || url.match(/^http:\/\//)) { return }
    const path = url.replace(/(\?.*)/, '')

    const params = queryString.parse(url)

    if (!shouldXhr) { return }

    evt.preventDefault()

    XHR.request(path, params)
  },
}

module.exports = XhrLink
