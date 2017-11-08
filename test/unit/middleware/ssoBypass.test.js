const { assign, set } = require('lodash')

describe('SSO bypass middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.mockConfig = {}
    this.ssoBypassMiddleware = proxyquire.noCallThru().load('~/src/middleware/sso-bypass', {
      '../../config': this.mockConfig,
    })
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('without oauth bypass token', () => {
    it('should call the next middleware without setting the session token', () => {
      this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

      expect(this.nextSpy.calledOnce).to.be.true
      expect(this.reqMock.session).to.be.an('object').and.empty
    })
  })

  describe('with oauth bypass token', () => {
    it('should set the session token', () => {
      const mockToken = 'mockToken'
      set(this.mockConfig, 'oauth.token', 'mockToken')
      this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

      expect(this.nextSpy.calledOnce).to.be.true
      expect(this.reqMock.session.token).to.equal(mockToken)
    })
  })
})
