const fixtures = require('./fixtures')
const urls = require('./urls')
const { setWorldConstructor } = require('cucumber')

/**
 * setup state object to be used across UAT tests
 * @constructor
 */
function World () {
  this.urls = urls
  this.fixtures = fixtures
  this.resetState = function () {
    this.state = {}
  }
  this.resetState()
}

setWorldConstructor(World)
