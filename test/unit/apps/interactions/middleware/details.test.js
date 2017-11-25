const advisersData = require('../../../data/advisers/advisers')
const interactionData = require('../../../data/interactions/new-interaction.json')
const servicesData = [
  { id: '9484b82b-3499-e211-a939-e4115bead28a', name: 'Account Management' },
  { id: '632b8708-28b6-e611-984a-e4115bead28a', name: 'Bank Referral' },
]
const contactsData = require('../../../data/contacts/contacts.json')
const eventsData = require('../../../data/events/collection.json')

const { assign, merge } = require('lodash')

const transformed = {
  id: '1',
  data: 'transformed',
}

describe('Interaction details middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.saveInteractionStub = this.sandbox.stub()
    this.fetchInteractionStub = this.sandbox.stub()
    this.getAdvisersStub = this.sandbox.stub()
    this.transformInteractionFormBodyToApiRequestStub = this.sandbox.stub()
    this.transformInteractionResponseToViewRecordStub = this.sandbox.stub()
    this.getContactsForCompanyStub = this.sandbox.stub()
    this.middleware = proxyquire('~/src/apps/interactions/middleware/details', {
      '../repos': {
        saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
        fetchInteraction: this.fetchInteractionStub.resolves(interactionData),
      },
      '../transformers': {
        transformInteractionFormBodyToApiRequest: this.transformInteractionFormBodyToApiRequestStub.returns(transformed),
        transformInteractionResponseToViewRecord: this.transformInteractionResponseToViewRecordStub.returns(transformed),
      },
      '../../adviser/repos': {
        getAdvisers: this.getAdvisersStub.resolves(advisersData),
      },
      '../../../lib/metadata': {
        getServices: () => { return servicesData },
      },
      '../../contacts/repos': {
        getContactsForCompany: this.getContactsForCompanyStub.returns(contactsData),
      },
      '../../events/repos': {
        getActiveEvents: this.sandbox.stub().resolves(eventsData.results),
      },
    })
    this.req = {
      session: {
        token: 'abcd',
      },
      flash: this.sandbox.spy(),
      body: assign({}, interactionData),
      query: {
        company: '299e7412-d9ee-4ab0-a4cb-a8cc00922c91',
      },
      params: {
        kind: 'interaction',
      },
    }
    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {
        company: {
          id: '1',
        },
        returnLink: '/return/',
      },
    }
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#postDetails', () => {
    context('when all fields are valid for creating', () => {
      beforeEach(async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should post to the API', async () => {
        expect(this.saveInteractionStub).to.have.been.calledWith(this.req.session.token)
        expect(this.saveInteractionStub).to.have.been.calledOnce
        expect(this.saveInteractionStub.firstCall.args[1]).to.deep.equal(transformed)
      })

      it('should flash a created message', async () => {
        expect(this.req.flash).to.be.calledWith('success', 'Interaction created')
      })

      it('should redirect on success', async () => {
        expect(this.res.redirect).to.be.calledWith('/return/1')
      })
    })

    context('when all fields are valid for updating', () => {
      beforeEach(async () => {
        const res = merge({}, this.res, {
          locals: {
            interaction: interactionData,
          },
        })
        await this.middleware.postDetails(this.req, res, this.nextSpy)
      })

      it('should flash an updated message', async () => {
        expect(this.req.flash).to.be.calledWith('success', 'Interaction updated')
      })
    })

    context('when all fields are valid for updating an interaction found from the top level navigation', () => {
      it('should redirect on success', async () => {
        const res = assign({}, this.res, {
          breadcrumb: this.sandbox.stub().returnsThis(),
          render: this.sandbox.spy(),
          redirect: this.sandbox.spy(),
          locals: {},
        })

        await this.middleware.postDetails(this.req, res, this.nextSpy)

        expect(res.redirect).to.be.calledWith('/interactions/1')
      })
    })

    context('when there is a 400', () => {
      beforeEach(async () => {
        this.saveInteractionStub.rejects({ statusCode: 400, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should set the errors', async () => {
        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', async () => {
        expect(this.nextSpy).have.been.calledWith()
        expect(this.nextSpy).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(async () => {
        this.saveInteractionStub.rejects({ statusCode: 500, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should not set form', async () => {
        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', async () => {
        expect(this.nextSpy).have.been.calledWith({ statusCode: 500, error: 'error' })
        expect(this.nextSpy).have.been.calledOnce
      })
    })
  })

  describe('#getInteractionDetails', () => {
    context('when success', () => {
      it('should set interaction data on locals', async () => {
        await this.middleware.getInteractionDetails(this.req, this.res, this.nextSpy, '1')
        expect(this.res.locals.interaction).to.deep.equal(interactionData)
      })

      it('should set company data on locals', async () => {
        await this.middleware.getInteractionDetails(this.req, this.res, this.nextSpy, '1')
        expect(this.res.locals.company).to.deep.equal(interactionData.company)
      })
    })
  })

  describe('#getInteractionOptions', () => {
    context('when interaction', () => {
      beforeEach(async () => {
        await this.middleware.getInteractionOptions(this.req, this.res, this.nextSpy)
      })

      it('should set contacts on locals', () => {
        expect(this.res.locals.contacts).to.deep.equal(contactsData)
      })

      it('should set advisers on locals', () => {
        expect(this.res.locals.advisers).to.deep.equal(advisersData)
      })

      it('should set services data on locals', async () => {
        expect(this.res.locals.services).to.deep.equal(servicesData)
      })

      it('should not set events data on locals', async () => {
        expect(this.res.locals.events).to.be.undefined
      })
    })

    context('when service delivery', () => {
      beforeEach(async () => {
        const req = merge({}, this.req, {
          params: {
            kind: 'service-delivery',
          },
        })
        await this.middleware.getInteractionOptions(req, this.res, this.nextSpy)
      })

      it('should set contacts on locals', () => {
        expect(this.res.locals.contacts).to.deep.equal(contactsData)
      })

      it('should set advisers on locals', () => {
        expect(this.res.locals.advisers).to.deep.equal(advisersData)
      })

      it('should set services data on locals', async () => {
        expect(this.res.locals.services).to.deep.equal(servicesData)
      })

      it('should set events data on locals', async () => {
        expect(this.res.locals.events).to.deep.equal(eventsData.results)
      })
    })
  })
})
