const { v4: uuid } = require('uuid')

const logger = require('../config/logger')
const config = require('../config')

const STS_MAX_AGE = 180 * 24 * 60 * 60

module.exports = function headers(
  req,
  res,
  next,
  // We allow nonce generator and mode to be pluggable for easy testing
  { nonceGenerator = uuid, mode = config.env } = {}
) {
  res.locals ||= {}
  res.locals.cspNonce = nonceGenerator()

  const selfAndNonce = `'self' 'nonce-${res.locals.cspNonce}'`

  res.set(
    'Content-Security-Policy',
    [
      `default-src ${selfAndNonce}`,
      // Taken from https://developers.google.com/tag-platform/security/guides/csp#google_analytics_4_google_analytics
      `script-src ${selfAndNonce} https://*.googletagmanager.com${mode === 'test' ? ` 'unsafe-eval'` : ''}`,
      `img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com`,
      `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
    ].join(';')
  )

  if (
    req.url.indexOf('/css') === -1 &&
    req.url.indexOf('/javascripts') === -1 &&
    req.url.indexOf('/images') === -1
  ) {
    logger.http('Headers middleware -> Adding response headers')

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('X-Frame-Options', 'DENY')
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('Strict-Transport-Security', `max-age=${STS_MAX_AGE}`)
  }
  next()
}
