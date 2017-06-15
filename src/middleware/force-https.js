const { isDev } = require('../../config')
const logger = require('../../config/logger')

module.exports = function forceHttps (req, res, next) {
  try {
    if (!isDev && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http') {
      const newUrl = `https://${req.headers.host}${req.url}`
      logger.info(`forcehttps: redirect to ${newUrl}`)
      res.writeHead(301, { Location: newUrl })
      return res.end()
    }
  } catch (error) {
    return next(error)
  }
  next()
}
