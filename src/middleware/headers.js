const logger = require('../config/logger')

module.exports = function headers(req, res, next) {
  if (
    req.url.indexOf('/css') === -1 &&
    req.url.indexOf('/javascripts') === -1 &&
    req.url.indexOf('/images') === -1
  ) {
    logger.debug('adding headers')

    const STS_MAX_AGE = 180 * 24 * 60 * 60

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('X-Frame-Options', 'DENY')
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('Strict-Transport-Security', `max-age=${STS_MAX_AGE}`)
  }
  next()
}
