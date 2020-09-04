const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { TextEncoder, TextDecoder } = require('util')

require('jsdom-global')()

global.rootPath = `${process.cwd()}`

const { getMacros } = require('../unit/macro-helper')

const formMacros = getMacros('form')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

global.JSDOM = JSDOM
global.formMacros = formMacros

chai.use(require('sinon-chai'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.proxyquire = proxyquire
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
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
