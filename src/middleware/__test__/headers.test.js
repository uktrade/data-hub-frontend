const headers = require('../headers')

const NONCE = 'DUMMY-NONCE'

const nonceGenerator = () => NONCE

describe('headers middleware', () => {
  it('should set headers', () => {
    const reqMock = { url: '/' }
    const resMock = { set: sinon.spy() }
    const nextMock = sinon.spy()

    headers(reqMock, resMock, nextMock, {
      nonceGenerator,
      mode: 'production',
    })

    expect(Object.fromEntries(resMock.set.args)).to.be.deep.equal({
      'Content-Security-Policy': [
        `default-src 'self' 'nonce-${NONCE}'`,
        `frame-ancestors 'none'`,
        `script-src 'self' 'nonce-${NONCE}' https://*.googletagmanager.com`,
        `img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com`,
        `connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com`,
      ].join(';'),
      'Cache-Control': 'no-cache, no-store',
      Pragma: 'no-cache',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=15552000',
    })

    expect(nextMock).to.be.called
  })
})
