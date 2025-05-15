const { v4: uuid } = require('uuid')
const _ = require('lodash')

const config = require('../config')

const STS_MAX_AGE = 180 * 24 * 60 * 60
const GOOGLE_TAG_MNGR = 'https://*.googletagmanager.com'
const GOOGLE_ANALYTICS = 'https://*.google-analytics.com'
const INVESTMENT_DOCUMENT_BUCKET_PROJECT = `https://s3.${config.s3Buckets.investmentDocuments.region}.amazonaws.com/${config.s3Buckets.investmentDocuments.bucket}/evidencedocument/`
const INVESTMENT_DOCUMENT_BUCKET_PROPOSITION = `https://s3.${config.s3Buckets.investmentDocuments.region}.amazonaws.com/${config.s3Buckets.investmentDocuments.bucket}/propositiondocument/`
const DOCUMENT_BUCKET_URL_ROOT = config.s3Buckets.documents.urlRoot

module.exports = function headers(
  req,
  res,
  next,
  // We allow nonce generator and mode to be pluggable for easy testing
  nonceGenerator = uuid
) {
  _.set(res, ['locals', 'cspNonce'], nonceGenerator())

  const selfAndNonce = `'self' 'nonce-${res.locals.cspNonce}'`

  res.set({
    'Content-Security-Policy': [
      `default-src ${selfAndNonce}`,
      // This prevents Data Hub to be loaded in iframes
      `frame-ancestors 'none'`,
      // Taken from https://developers.google.com/tag-platform/security/guides/csp#google_analytics_4_google_analytics
      `script-src ${selfAndNonce} ${GOOGLE_TAG_MNGR}`,
      `img-src 'self' ${GOOGLE_ANALYTICS} ${GOOGLE_TAG_MNGR}`,
      `connect-src 'self' ${GOOGLE_ANALYTICS} ${GOOGLE_TAG_MNGR} https://*.analytics.google.com ${INVESTMENT_DOCUMENT_BUCKET_PROJECT} https://raven.ci.uktrade.io ${INVESTMENT_DOCUMENT_BUCKET_PROPOSITION} ${DOCUMENT_BUCKET_URL_ROOT}`,
    ].join(';'),
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
