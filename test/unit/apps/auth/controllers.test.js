describe('Auth page controllers', () => {
  const { renderSignInPage, signOut } = require('~/src/apps/auth/controllers')

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.req = {
      flash: this.sandbox.spy(),
      session: {
        token: 'abcd',
      },
    }

    this.res = {
      title: this.sandbox.stub(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {},
    }

    this.res.title.returns(this.res)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderSignInPage', () => {
    it('should redirect to home page if logged in', () => {
      this.req.session.user = { name: 'Tyom' }
      renderSignInPage(this.req, this.res)

      expect(this.res.redirect).to.be.calledWith('/')
    })

    it('should add form object to locals when rendered', () => {
      renderSignInPage(this.req, this.res)

      expect(this.res.title).to.be.calledWith(sinon.match.string)
      expect(this.res.render).to.be.calledWith(sinon.match.string, sinon.match(value => {
        return value.signInForm && value.signInForm
      }))
    })
  })

  describe('#signOut', () => {
    it('should reset session properties when called', () => {
      this.req.session.user = { name: 'Tyom' }
      signOut(this.req, this.res, this.next)

      expect(this.req.session.returnTo).to.be.null
      expect(this.req.session.token).to.be.null
      expect(this.req.session.user).to.be.null
    })

    it('should redirect and call flash message when called', () => {
      signOut(this.req, this.res, this.next)

      expect(this.req.flash).to.be.calledWith('success', sinon.match.string)
      expect(this.res.redirect).to.be.calledWith('/sign-in')
    })
  })
})
