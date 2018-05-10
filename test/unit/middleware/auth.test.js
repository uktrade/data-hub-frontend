const { assign } = require('lodash')

describe('Auth middleware', () => {
  beforeEach(() => {
    this.authMiddleware = require('~/src/middleware/auth')
    this.nextSpy = sinon.spy()
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.resMock = assign({}, globalRes)
  })

  describe('authenticated/allowed requests', () => {
    describe('when request contains an allowed url', () => {
      it('call the next middleware', () => {
        this.reqMock = assign({}, this.reqMock, {
          url: '/oauth/callback',
        })

        this.authMiddleware(this.reqMock, this.resMock, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
      })
    })
  })

  describe('when session token is set', () => {
    it('call the next middleware', () => {
      this.reqMock = assign({}, this.reqMock, {
        url: '',
        session: {
          token: 'abcd',
        },
      })

      this.authMiddleware(this.reqMock, this.resMock, this.nextSpy)

      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('unauthenticated requests', () => {
    it('should set the requested url on the session and redirect', () => {
      this.reqMock = assign({}, this.reqMock, {
        url: '/protected-url',
        originalUrl: '/protected-url',
        session: {},
      })
      this.resMock = assign({}, this.resMock, {
        redirect: sinon.stub(),
      })

      this.authMiddleware(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.session).to.have.property('returnTo')
      expect(this.reqMock.session.returnTo).to.equal('/protected-url')
      expect(this.nextSpy).not.to.be.called
      expect(this.resMock.redirect).to.be.calledWith('/oauth')
    })
  })
})
