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

  describe('when in production mode', () => {
    context('without oauth token', () => {
      it('should call the next middleware without setting the session token', () => {
        set(this.mockConfig, 'isDev', false)
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.reqMock.session).to.be.an('object').and.empty
      })
    })

    context('with oauth token', () => {
      it('should call the next middleware without setting the session token', () => {
        set(this.mockConfig, 'isDev', false)
        set(this.mockConfig, 'oauth.token', 'mockToken')
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.reqMock.session).to.be.an('object').and.empty
      })
    })
  })

  describe('when in development mode', () => {
    context('without oauth token', () => {
      it('should call the next middleware without setting the session token', () => {
        set(this.mockConfig, 'isDev', true)
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.reqMock.session).to.be.an('object').and.empty
      })
    })

    context('with oauth token', () => {
      it('should call the next middleware without setting the session token', () => {
        const mockToken = 'mockToken'

        set(this.mockConfig, 'isDev', true)
        set(this.mockConfig, 'oauth.token', mockToken)
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.reqMock.session.token).to.equal(mockToken)
        expect(this.reqMock.session).to.be.an('object').and.not.empty
      })
    })
  })
})
