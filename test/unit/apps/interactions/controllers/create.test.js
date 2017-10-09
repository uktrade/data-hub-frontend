const { assign } = require('lodash')

describe('Create interaction, step 1', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.selectKindFormConfigStub = this.sandbox.spy()

    this.create = proxyquire('~/src/apps/interactions/controllers/create', {
      '../macros': {
        selectKindFormConfig: this.selectKindFormConfigStub,
      },
    })

    this.sandbox = sinon.sandbox.create()
    this.req = {
      query: {},
      session: {
        token: '4321',
      },
      body: {},
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      redirect: this.sandbox.spy(),
      render: this.sandbox.spy(),
      locals: {},
    }

    this.next = this.sandbox.spy()
  })

  describe('#postcreate', () => {
    context('when a request is made to add an interaction from a company contact', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
            returnLink: '/contacts/4321/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/interactions/create/interaction?')
      })

      it('should pass on the company id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('company=1234')
      })

      it('should pass on the contact id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('contact=4321')
      })

      it('should pass on the return url, correctly encoded', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('returnLink=%2Fcontacts%2F4321%2Finteractions')
      })
    })

    context('whan a request is made to add an interaction from a company', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'interaction',
          },
          query: {
            company: '1234',
            returnLink: '/companies/1234/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/interactions/create/interaction?')
      })

      it('should pass on the company id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('company=1234')
      })

      it('should pass on the return url, correctly encoded', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('returnLink=%2Fcompanies%2F1234%2Finteractions')
      })
    })

    context('when a request is made to add an interaction from an investment project', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'interaction',
          },
          query: {
            investment: '4444',
            company: '1234',
            returnLink: '/investment-projects/444/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/interactions/create/interaction?')
      })

      it('should pass on the company id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('company=1234')
      })

      it('should pass on the investment id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('investment=4444')
      })

      it('should pass on the return url, correctly encoded', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('returnLink=%2Finvestment-projects%2F444%2Finteractions')
      })
    })

    context('when a request is made to add a service delivery from a company contact', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'service_delivery',
          },
          query: {
            company: '1234',
            contact: '4321',
            returnLink: '/contacts/4321/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create service delivery page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/interactions/create/service-delivery?')
      })

      it('should pass on the company id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('company=1234')
      })

      it('should pass on the contact id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('contact=4321')
      })

      it('should pass on the return url, correctly encoded', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('returnLink=%2Fcontacts%2F4321%2Finteractions')
      })
    })

    context('when a request is made to add a service delivery from a company', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'service_delivery',
          },
          query: {
            company: '1234',
            returnLink: '/companies/1234/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create service delivery page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/interactions/create/service-delivery?')
      })

      it('should pass on the company id in the url', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('company=1234')
      })

      it('should pass on the return url, correctly encoded', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('returnLink=%2Fcompanies%2F1234%2Finteractions')
      })
    })

    context('when a request is made with no select', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          query: {
            company: '1234',
            returnLink: '/companies/1234/interactions',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should add an error to the response', () => {
        expect(this.res.locals.errors.messages.kind).to.deep.equal(['You must select an interaction type'])
      })

      it('should continue onto the render form controller', () => {
        expect(this.next).to.be.calledOnce
      })
    })
  })

  describe('renderCreate', () => {
    context('when a request is made with no errors', () => {
      beforeEach(() => {
        this.create.renderCreate(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.selectKindFormConfigStub).to.be.calledWith({ errors: [] })
      })

      it('render the correct template', () => {
        expect(this.res.render).to.be.calledWith('interactions/views/create.njk')
      })
    })

    context('when a request is made with errors', () => {
      beforeEach(() => {
        this.res.locals.errors = {}
        this.create.renderCreate(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.selectKindFormConfigStub).to.be.calledWith({ errors: this.res.locals.errors })
      })
    })
  })
})
