const proxyquire = require('proxyquire')

describe('Create proposition', () => {
  beforeEach(() => {
    this.propositionFormStub = sinon.spy()

    this.create = proxyquire('../create', {
      '../macros': {
        propositionForm: this.propositionFormStub,
      },
    })

    this.req = {
      query: {},
      session: {
        token: '4321',
        user: {
          permissions: ['proposition.add_policy_feedback_proposition'],
          hiddenFields: { id: 123, investment_project: 321 },
        },
      },
      body: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      redirect: sinon.spy(),
      render: sinon.spy(),
      locals: {
        returnLink: '/return/',
        investment: {
          name: 'Bassanio wooing Portia',
        },
      },
    }

    this.next = sinon.spy()
  })

  describe('renderCreatePage', () => {
    context('when a request is made with no errors', () => {
      beforeEach(async () => {
        await this.create.renderCreatePage(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.propositionFormStub).to.be.called
      })

      it('render the correct template', () => {
        expect(this.res.render).to.be.calledWith('propositions/views/create.njk')
      })
    })

    context('when a request is made with errors', () => {
      beforeEach(async () => {
        this.res.locals.errors = {}
        await this.create.renderCreatePage(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.propositionFormStub).to.be.called
      })
    })
  })
})
