const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const interactionData = require('../../../../../test/unit/data/interactions/interaction.json')

const modulePath = '../details'

describe('Interaction details middleware', () => {
  describe('#getInteractionDetails', () => {
    before(() => {
      this.fetchInteractionStub = sinon.stub()
      this.getContactStub = sinon.stub()
      this.getDitCompanyStub = sinon.stub()

      this.middleware = proxyquire(modulePath, {
        '../repos': {
          fetchInteraction: this.fetchInteractionStub.resolves(interactionData),
        },
        '../../adviser/filters': {
          filterActiveAdvisers: this.filterActiveAdvisersSpy,
        },
        '../../contacts/repos': {
          getContact: this.getContactStub,
        },
        '../../companies/repos': {
          getDitCompany: this.getDitCompanyStub,
        },
      })

      this.middlewareParameters = buildMiddlewareParameters({
        requestBody: { ...interactionData },
        requestParams: {
          kind: 'interaction',
        },
        interactions: {
          returnLink: '/return/',
        },
      })
    })

    context('when provided an interaction with a company associated', () => {
      before(async () => {
        this.companies = sinon.mock()
        this.interaction = {
          ...interactionData,
          companies: [this.company],
        }
        this.fetchInteractionStub.resolves(this.interaction)

        await this.middleware.getInteractionDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
          '1'
        )
      })

      it('should set interaction data on locals', () => {
        expect(
          this.middlewareParameters.resMock.locals.interaction
        ).to.deep.equal(this.interaction)
      })
      it('should set interaction company data on locals', () => {
        expect(this.middlewareParameters.resMock.locals.company).to.deep.equal(
          this.interaction.companies[0]
        )
      })
    })

    context('when provided an investment interaction with no company', () => {
      before(async () => {
        this.interaction = {
          ...interactionData,
          companies: null,
          contact: {
            id: '4444',
          },
        }

        this.fetchInteractionStub.resolves(this.interaction)

        this.getContactStub.resolves({
          companies: [
            {
              id: '1234',
            },
          ],
        })

        this.company = sinon.mock()
        this.getDitCompanyStub.resolves(this.company)

        await this.middleware.getInteractionDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
          '1'
        )
      })

      it('should set interaction data on locals', () => {
        expect(
          this.middlewareParameters.resMock.locals.interaction
        ).to.deep.equal(this.interaction)
      })
    })
  })
})
