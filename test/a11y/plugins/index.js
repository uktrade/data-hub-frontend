/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
module.exports = (on, config) => {
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  })
}
