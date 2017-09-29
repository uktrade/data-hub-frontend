/**
 * A pause convenience method. Name changed so as not to confuse with the stop
 * associated with a .pause() call without arguments
 * @param duration
 * @returns {*|{error}}
 */
exports.command = function wait (duration = this.globals.pauseDuration) {
  return this.perform((done) => {
    this.pause(duration, done)
  })
}
