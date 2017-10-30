const fixtures = require('./fixtures')
const urls = require('./urls')
const { defineSupportCode } = require('cucumber')

/**
 * setup state object to be used across UAT tests
 * @constructor
 */
function World () {
  this.urls = urls
  this.fixtures = fixtures
  this.state = {}
  this.resetState = function () {
    this.state = {}
  }
}

defineSupportCode(({ setWorldConstructor }) => {
  setWorldConstructor(World)
})
