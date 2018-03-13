const chai = require('chai')
const sinon = require('sinon')
require('jsdom-global')()

chai.use(require('sinon-chai'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
chai.config.truncateThreshold = 0

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)

// Patch lack of support for closest in jsdom
window.Element.prototype.closest = function (selector) {
  let el = this
  while (el) {
    if (el.matches(selector)) {
      return el
    }
    el = el.parentElement
  }
}
