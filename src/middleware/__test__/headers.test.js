const headers = require('../headers')

const NONCE = 'DUMMY-NONCE'

const CSP_HEADER = [
  'Content-Security-Policy',
  [
    `default-src 'self' 'nonce-${NONCE}'`,
    `script-src 'self' 'nonce-${NONCE}' https://*.googletagmanager.com`,
    `img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com`,
    `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  ].join(';'),
]

const nonceGenerator = () => NONCE

describe('headers middleware', () => {
  context('when the resource is not an asset', () => {
    it('should set headers', () => {
      const reqMock = { url: '/' }
      const resMock = { set: sinon.spy() }
      const nextMock = sinon.spy()

      headers(reqMock, resMock, nextMock, nonceGenerator)

      expect(resMock.set.args).to.be.deep.equal([
        CSP_HEADER,
        ['Cache-Control', 'no-cache, no-store, must-revalidate, private'],
        ['Pragma', 'no-cache'],
        ['X-Frame-Options', 'DENY'],
        ['X-Content-Type-Options', 'nosniff'],
        ['X-XSS-Protection', '1; mode=block'],
        ['Strict-Transport-Security', 'max-age=15552000'],
      ])

      expect(nextMock).to.be.called
    })
  })

  context('when the resource is an asset', () => {
    it('should not set the headers', () => {
      const reqMock = { url: '/javascripts/foo.js' }
      const resMock = { set: sinon.spy() }
      const nextMock = sinon.spy()

      headers(reqMock, resMock, nextMock, nonceGenerator)

      expect(resMock.set.args).to.be.deep.equal([CSP_HEADER])

      expect(nextMock).to.be.called
    })
  })
})
