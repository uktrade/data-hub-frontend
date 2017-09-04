const rewire = require('rewire')

describe('Auth page middleware', () => {
  const middleware = rewire('~/src/apps/auth/middleware')

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.req = {
      flash: this.sandbox.spy(),
      session: {
        returnTo: '/contacts',
      },
      body: {},
    }

    this.res = {
      redirect: this.sandbox.spy(),
      locals: {},
    }

    this.next = this.sandbox.spy()

    this.authenticateStub = this.sandbox.stub().resolves()
    middleware.__set__('authenticate', this.authenticateStub)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#handleSignIn', () => {
    beforeEach(() => {
      this.req.body = {
        username: 'tyom',
        password: 'kittens',
      }
    })

    it('should add form error when username or password is not provided', () => {
      this.req.body.password = null
      middleware.handleSignIn(this.req, this.res, this.next)

      expect(this.res.locals.signInForm).to.have.property('errors').to.deep.equal({
        summary: 'Please provide email and password',
        messages: {},
      })

      expect(this.next).to.be.called
    })

    it('should call authenticate with username and password', () => {
      middleware.handleSignIn(this.req, this.res, this.next)

      expect(this.authenticateStub).to.be.calledWith('tyom', 'kittens')
    })

    it('should call redirect to originally viewed page when logged in', async () => {
      this.authenticateStub.resolves({
        access_token: ':)',
      })

      await middleware.handleSignIn(this.req, this.res, this.next)

      expect(this.req.session.token).to.equal(':)')
      expect(this.res.redirect).to.be.calledWith('/contacts')
    })

    it('should flash error message and redirect to sign-in page if authentication fails', async () => {
      this.authenticateStub.rejects({
        response: {
          statusCode: 401,
        },
      })

      await middleware.handleSignIn(this.req, this.res, this.next)

      expect(this.req.session.token).to.be.undefined
      expect(this.next).to.not.be.called

      expect(this.req.flash).to.be.calledWith('error', sinon.match.string)
      expect(this.res.redirect).to.be.calledWith('/sign-in')
    })

    it('should call next middleware with error for all other errors', async () => {
      const errorResponse = {
        response: {
          statusCode: 500,
        },
      }

      this.authenticateStub.rejects(errorResponse)

      await middleware.handleSignIn(this.req, this.res, this.next)

      expect(this.next).to.be.calledWith(errorResponse)
    })
  })
})
