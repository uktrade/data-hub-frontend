const { assign } = require('lodash')
const proxyquire = require('proxyquire')

describe('Create interaction, step 1', () => {
  beforeEach(() => {
    this.kindFormStub = sinon.spy()

    this.create = proxyquire('../create', {
      '../macros': {
        kindForm: this.kindFormStub,
      },
    })

    this.req = {
      query: {},
      session: {
        token: '4321',
        user: {
          permissions: ['interaction.add_policy_feedback_interaction'],
        },
      },
      body: {},
      params: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      redirect: sinon.spy(),
      render: sinon.spy(),
      locals: {
        interactions: {
          returnLink: '/return/',
        },
      },
    }

    this.next = sinon.spy()
  })

  describe('#postcreate', () => {
    context('when a request is made to add an interaction and the theme is "export" and the kind is "interaction"', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'interaction',
            kind_export: 'export_interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/create/export/interaction')
      })
    })

    context('when a request is made to add an interaction and the theme is "service_delivery" and the kind is "export_service_delivery"', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'service_delivery',
            kind_export: 'export_service_delivery',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/create/export/service-delivery')
      })
    })

    context('when a request is made to add an interaction and the theme is "investment_interaction" and the kind is "interaction"', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'investment_interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/create/investment/interaction')
      })
    })

    context('when a request is made to add an interaction and the theme is "service_delivery" and the kind is "interaction"', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'service_delivery',
            kind_other: 'other_interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create service delivery page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/create/other/interaction')
      })
    })

    context('when a request is made to add an interaction and the theme is "service_delivery" and the kind is "other_service_delivery"', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'service_delivery',
            kind_other: 'other_service_delivery',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create service delivery page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/create/other/service-delivery')
      })
    })

    context('when a request is made with no theme selected', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          query: {
            company: '1234',
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

    context('when a request is made with a theme selected but no kind export selected', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'a theme',
            kind_export: '',
          },
          query: {
            company: '1234',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should add an error to the response', () => {
        expect(this.res.locals.errors.messages.kind).to.deep.equal(['You must select what you would like to record'])
      })

      it('should continue onto the render form controller', () => {
        expect(this.next).to.be.calledOnce
      })
    })

    context('when a request is made with a theme selected but no kind other selected', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'a theme',
            kind_other: '',
          },
          query: {
            company: '1234',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should add an error to the response', () => {
        expect(this.res.locals.errors.messages.kind).to.deep.equal(['You must select what you would like to record'])
      })

      it('should continue onto the render form controller', () => {
        expect(this.next).to.be.calledOnce
      })
    })

    context('when a request is made for an existing interaction', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            theme: 'interaction',
            kind_export: 'export_interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
          params: {
            interactionId: '1',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the edit interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/1/edit/export/interaction')
      })
    })
  })

  describe('renderCreate', () => {
    context('when a request is made with no errors', () => {
      beforeEach(() => {
        this.create.renderCreate(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.kindFormStub).to.be.calledWith({
          errors: [],
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
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
        expect(this.kindFormStub).to.be.calledWith({
          errors: this.res.locals.errors,
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
      })
    })
  })
})
