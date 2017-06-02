const resMock = {}

describe('Auth middleware', () => {
  beforeEach(() => {
    this.authMiddleware = require('~/src/middleware/auth')
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('authenticated/allowed requests', () => {
    describe('when request contains an allowed url', () => {
      it('call the next middleware', () => {
        const reqMock = {
          url: '/login'
        }

        this.authMiddleware(reqMock, resMock, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
      })
    })
  })

  describe('when session token is set', () => {
    it('call the next middleware', () => {
      const reqMock = {
        url: '',
        session: {
          token: 'abcd'
        }
      }

      this.authMiddleware(reqMock, resMock, this.nextSpy)

      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('unauthenticated requests', () => {
    it('should set the requested url on the session and redirect', () => {
      const reqMock = {
        url: '/protected-url',
        originalUrl: '/protected-url',
        session: {}
      }
      const resMock = {
        redirect: this.sandbox.stub()
      }

      this.authMiddleware(reqMock, resMock, this.nextSpy)

      expect(reqMock.session).to.have.property('returnTo')
      expect(reqMock.session.returnTo).to.equal('/protected-url')
      expect(this.nextSpy).not.to.be.called
      expect(resMock.redirect).to.be.calledWith('/login')
    })
  })
})
