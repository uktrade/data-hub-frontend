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
  this.resetState = function () {
    this.state = {
      username: 'Circle Ci',
    }
  }
  this.resetState()
}

defineSupportCode(({ setWorldConstructor }) => {
  setWorldConstructor(World)
})
