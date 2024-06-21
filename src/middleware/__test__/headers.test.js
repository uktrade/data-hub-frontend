const headers = require('../headers')
const config = require('../../config')

const NONCE = 'DUMMY-NONCE'

describe('headers middleware', () => {
  it('should set expected headers', () => {
    const reqMock = { url: '/' }
    const resMock = { set: sinon.spy() }
    const nextMock = sinon.spy()

    const INVESTMENT_DOCUMENT_BUCKET_PROJECT = `https://s3.${config.s3Buckets.investmentDocuments.region}.amazonaws.com/${config.s3Buckets.investmentDocuments.bucket}/evidencedocument/`
    const INVESTMENT_DOCUMENT_BUCKET_PROPOSITION = `https://s3.${config.s3Buckets.investmentDocuments.region}.amazonaws.com/${config.s3Buckets.investmentDocuments.bucket}/propositiondocument/`

    headers(reqMock, resMock, nextMock, () => NONCE)

    expect(resMock.set.args).to.be.deep.equal([
      [
        {
          'Content-Security-Policy': [
            `default-src 'self' 'nonce-${NONCE}'`,
            `frame-ancestors 'none'`,
            `script-src 'self' 'nonce-${NONCE}' https://*.googletagmanager.com`,
            `img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com`,
            `connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com ${INVESTMENT_DOCUMENT_BUCKET_PROJECT} https://raven.ci.uktrade.io ${INVESTMENT_DOCUMENT_BUCKET_PROPOSITION}`,
          ].join(';'),
          'Cache-Control': 'no-cache, no-store',
          Pragma: 'no-cache',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Strict-Transport-Security': 'max-age=15552000',
        },
      ],
    ])

    expect(nextMock).to.be.called
  })
})
