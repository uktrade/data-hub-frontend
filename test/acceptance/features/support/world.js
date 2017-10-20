const { defineSupportCode } = require('cucumber')

/**
 * setup state object to be used across UAT tests
 * @constructor
 */
function World () {
  this.state = {}
  this.resetState = function () {
    this.state = {}
  }
}

defineSupportCode(({ setWorldConstructor }) => {
  setWorldConstructor(World)
})
