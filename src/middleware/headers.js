const { v4: uuid } = require('uuid')
const _ = require('lodash')

const config = require('../config')

const STS_MAX_AGE = 180 * 24 * 60 * 60
const GOOGLE_TAG_MNGR = 'https://*.googletagmanager.com'
const GOOGLE_ANALYTICS = 'https://*.google-analytics.com'

const nonBlockingNonceGenerator = () => {
  let nonce = uuid()
  return () => {
    setTimeout(() => {
      nonce = uuid()
    }, 0)
    return nonce
  }
}

module.exports = function headers(
  req,
  res,
  next,
  // We allow nonce generator and mode to be pluggable for easy testing
  { nonceGenerator = nonBlockingNonceGenerator(), mode = config.env } = {}
) {
  const nonce = nonceGenerator()
  console.log('NONCEEEEEEEEEEEEE', nonce)
  _.set(res, ['locals', 'cspNonce'], nonce)
  // _.set(res, ['locals', 'cspNonce'], 'foooooooo')
  // res.locals.cspNonce = 'foooooooooo'

  // We have to enable unsafe-eval in tests because code instrumented
  // for coverage by the Istanbul library ends up with lots of evals
  // const testCoverage = mode === 'test' ? ` 'unsafe-eval'` : ''

  // const selfAndNonce = `'self' 'nonce-${res.locals.cspNonce}'`

  // res.set(
  //   'Content-Security-Policy',
  //   [
  //     `default-src ${selfAndNonce}`,
  //     // This prevents Data Hub to be loaded in iframes
  //     `frame-ancestors 'none'`,
  //     // Taken from https://developers.google.com/tag-platform/security/guides/csp#google_analytics_4_google_analytics
  //     `script-src ${selfAndNonce} ${GOOGLE_TAG_MNGR}${testCoverage}`,
  //     `img-src 'self' ${GOOGLE_ANALYTICS} ${GOOGLE_TAG_MNGR}`,
  //     `connect-src 'self' ${GOOGLE_ANALYTICS} ${GOOGLE_TAG_MNGR} https://*.analytics.google.com`,
  //   ].join(';')
  // )

  res.set({
    // This is equivalent to `frame-ancestors 'none'` in the above CSP policy,
    // but keeping it here for older browsers
    'X-Frame-Options': 'DENY',
    // Prevent Content Sniffing
    'X-Content-Type-Options': 'nosniff',
    // Tell the browser to always require HTTPS
    'Strict-Transport-Security': `max-age=${STS_MAX_AGE}`,
    // No caching as suggested in pen test report
    'Cache-Control': 'no-cache, no-store',
    Pragma: 'no-cache',
  })

  next()
}
