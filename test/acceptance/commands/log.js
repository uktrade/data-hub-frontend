/**
 * wrapper around console.log mainly so we don't have console.log everywhere
 * @param message
 * @returns {*|{error}}
 */
exports.command = function log (message) {
  return this.perform((done) => {
    console.log(message)
    done()
  })
}
