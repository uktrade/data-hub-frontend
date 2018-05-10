const { assign, set } = require('lodash')

describe('SSO bypass middleware', () => {
  beforeEach(() => {
    this.mockConfig = {}
    this.ssoBypassMiddleware = proxyquire.noCallThru().load('~/src/middleware/sso-bypass', {
      '../../config': this.mockConfig,
    })
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.nextSpy = sinon.spy()
  })

  context('Oauth bypass token set to false', () => {
    beforeEach(() => {
      set(this.mockConfig, 'oauth.bypassSSO', false)
    })

    context('and without a developer token set', () => {
      beforeEach(() => {
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)
      })

      it('should call the next middleware', () => {
        expect(this.nextSpy.calledOnce).to.be.true
      })

      it('should not set the session token', () => {
        expect(this.reqMock.session).to.be.an('object').and.empty
      })
    })

    context('and with a developer token set', () => {
      beforeEach(() => {
        this.mockDevToken = 'mockDevToken'
        set(this.mockConfig, 'oauth.devToken', this.mockDevToken)
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)
      })

      it('should call the next middleware', () => {
        expect(this.nextSpy.calledOnce).to.be.true
      })

      it('should not set the session token', () => {
        expect(this.reqMock.session).to.be.an('object').and.empty
      })
    })
  })

  context('Oauth bypass token set to true', () => {
    beforeEach(() => {
      set(this.mockConfig, 'oauth.bypassSSO', true)
    })

    context('and with a developer token set', () => {
      beforeEach(() => {
        this.mockDevToken = 'mockDevToken'
        set(this.mockConfig, 'oauth.devToken', this.mockDevToken)
        this.ssoBypassMiddleware()(this.reqMock, {}, this.nextSpy)
      })

      it('should call the next middleware', () => {
        expect(this.nextSpy.calledOnce).to.be.true
      })

      it('should set the session token', () => {
        expect(this.reqMock.session.token).to.equal(this.mockDevToken)
      })
    })
  })
})
