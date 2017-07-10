const interactionTransformedFromApiData = require('~/test/unit/data/investment/interaction/interaction-transformed-from-api.json')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const metadataRepositoryStub = {
  salaryRangeOptions: [
    { id: '1', name: 'Below 10k' },
    { id: '2', name: 'Above 10k' },
  ],
  interactionTypeOptions: [
    { id: 'a6d71fdd-5d95-e211-a939-e4115bead28a', name: 'Business Card' },
    { id: '70c226d7-5d95-e211-a939-e4115bead28a', name: 'example' },
  ],
}
const { interactionsLabels } = require('~/src/apps/investment-projects/labels')
const errorMsg = 'mock error'

describe('Investment form middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().resolves(advisorData)
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {},
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/form', {
      '../../../lib/metadata': metadataRepositoryStub,
      '../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateInteractionsFormMiddleware', () => {
    it('should call next', (done) => {
      const mockAdviser = advisorData.results[0]
      const expectedAdvisors = [
        { id: mockAdviser.id, name: mockAdviser.name },
      ]

      this.resMock.locals.investmentData = investmentData
      this.resMock.locals.interaction = interactionTransformedFromApiData

      this.controller.populateInteractionsFormMiddleware({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals).to.deep.equal({
          investmentData,
          interaction: interactionTransformedFromApiData,
          form: {
            labels: interactionsLabels.edit,
            state: interactionTransformedFromApiData,
            options: {
              advisers: expectedAdvisors,
              contacts: investmentData.client_contacts,
              interactionTypes: metadataRepositoryStub.interactionTypeOptions,
            },
          },
        })

        done()
      })
    })

    it('should set correct form data', (done) => {
      const mockAdviser = advisorData.results[0]
      const expectedAdvisors = [
        { id: mockAdviser.id, name: mockAdviser.name },
      ]

      this.resMock.locals.investmentData = investmentData

      this.controller.populateInteractionsFormMiddleware({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.labels).to.eql(interactionsLabels.edit)
        expect(this.resMock.locals.form.options.interactionTypes).to.deep.equal(metadataRepositoryStub.interactionTypeOptions)
        expect(this.resMock.locals.form.options.advisers).to.deep.equal(expectedAdvisors)
        expect(this.resMock.locals.form.options.contacts).to.deep.equal(investmentData.client_contacts)
        done()
      })
    })
  })
})

describe('Investment form middleware - error testing', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().rejects(errorMsg)
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {},
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/form', {
      '../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateInteractionsFormMiddleware', () => {
    it('should call next with errors', (done) => {
      this.controller.populateInteractionsFormMiddleware({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, (error) => {
        expect(error.name).to.equal(errorMsg)
        done()
      })
    })
  })
})
