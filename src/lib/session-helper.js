const logger = require('./../../config/logger')

/**
 * Promise wrapper around expressjs session reload callback method
 * @param session
 * @returns {Promise}
 */
function reloadSession ({ session }) {
  return new Promise((resolve, reject) => {
    session.reload((error) => {
      if (error) {
        return reject(error)
      }

      logger.error('Session reloaded')
      resolve()
    })
  })
}

module.exports = {
  reloadSession,
}
