const { setWorldConstructor } = require('cucumber')

/**
 * setup state object to be used across UAT tests
 * @constructor
 */
function World() {
  this.resetState = function() {
    this.state = {}
  }
  this.resetState()
}

setWorldConstructor(World)
