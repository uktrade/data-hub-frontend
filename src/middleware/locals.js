const logger = require('../../config/logger')
const pjson = require('../../package.json')
const config = require('../../config')

const startTime = new Date().getTime()

module.exports = function locals (req, res, next) {
  logger.debug('locals:start')
  const baseUrl = `${(req.encrypted ? 'https' : req.protocol)}://${req.get('host')}`

  res.locals.releaseVersion = pjson.version
  res.locals.startTime = startTime
  res.locals.referer = req.headers.referer
  res.locals.env = config.env
  res.locals.googleTagManagerKey = config.googleTagManagerKey
  res.locals.query = req.query
  res.locals.currentPath = req.path
  res.locals.BASE_URL = baseUrl
  res.locals.CANONICAL_URL = baseUrl + req.originalUrl
  logger.debug('locals:end')
  next()
}
