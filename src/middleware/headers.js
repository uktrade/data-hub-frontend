const logger = require('../../config/logger')

module.exports = function auth (req, res, next) {
  if (req.url.indexOf('/css') === -1 && req.url.indexOf('/javascripts') === -1 && req.url.indexOf('/images') === -1) {
    logger.debug('adding headers')
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('X-Frame-Options', 'DENY')
    res.set('X-Content-Type-Options', 'nosniff')
  }
  next()
}
