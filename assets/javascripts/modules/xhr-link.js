const queryString = require('query-string')
const AutoSubmit = require('./auto-submit')
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

    if (!url || url.match(/^http:\/\//)) { return }
    const path = url.match(/^(.*)\?/)[1]

    const hasXhrClass = target.classList.contains(this.selector.substring(1))
    const shouldXhr = target.tagName === 'A' && this.isGlobal ? true : hasXhrClass
    const params = queryString.parse(url)

    if (!shouldXhr) { return }

    evt.preventDefault()

    XHR
      .request(path, params)
      .then(() => AutoSubmit.hideActionButtons())
  },
}

module.exports = XhrLink
