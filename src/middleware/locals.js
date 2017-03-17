const winston = require('winston')
const pjson = require('../../package.json')
const config = require('../config')

const startTime = new Date().getTime()

module.exports = function locals (req, res, next) {
  winston.debug('locals:start')
  res.locals.baseUrl = req.baseUrl
  res.locals.releaseVersion = pjson.version
  res.locals.startTime = startTime
  res.locals.asset_path = '/'
  res.locals.referer = req.headers.referer
  res.locals.env = config.env
  res.locals.googleTagManager = config.googleTagManager
  res.locals.query = req.query
  winston.debug('locals:end')
  next()
}
