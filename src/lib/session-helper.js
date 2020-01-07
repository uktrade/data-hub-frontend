/**
 * promise wrapper around express session save method
 * @param req
 * @returns {Promise}
 */
function saveSession(session) {
  return new Promise((resolve, reject) => {
    session.save((error) => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

module.exports = {
  saveSession,
}
