const interactionTransformedFromApiData = require('~/test/unit/data/investment/interaction/interaction-transformed-from-api.json')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const mockServices = [
  { id: 'example-service-id-1', name: 'Example service A' },
  { id: 'example-service-id-2', name: 'Example service B' },
]
const metadataRepositoryStub = {
  salaryRangeOptions: [
    { id: '1', name: 'Below 10k' },
    { id: '2', name: 'Above 10k' },
  ],
  interactionTypeOptions: [
    { id: 'a6d71fdd-5d95-e211-a939-e4115bead28a', name: 'Business Card' },
    { id: '70c226d7-5d95-e211-a939-e4115bead28a', name: 'example' },
  ],
  teams: [
    { id: 'example-team-id-1', name: 'Example Team A' },
    { id: 'example-team-id-1', name: 'Example Team B' },
  ],
  getServices: sinon.stub().resolves(mockServices),
}
const { interactionsLabels } = require('~/src/apps/investment-projects/labels')
const errorMsg = 'mock error'
const transformToExpectedObject = ({ id, name }) => {
  return {
    value: id,
    label: name,
  }
}

describe('Investment form middleware - interactions', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().resolves(advisorData)
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {},
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/interactions', {
      '../../../../lib/metadata': metadataRepositoryStub,
      '../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateInteractionsFormMiddleware', () => {
    it('should call next', (done) => {
      const expectedAdvisors = advisorData.results.map(transformToExpectedObject)
      const expectedServiceTypes = mockServices.map(transformToExpectedObject)
      const expectedTeams = metadataRepositoryStub.teams.map(transformToExpectedObject)
      const expectedInteractionTypes = metadataRepositoryStub.interactionTypeOptions.map(transformToExpectedObject)

      this.resMock.locals.investmentData = investmentData
      this.resMock.locals.interaction = interactionTransformedFromApiData

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        try {
          expect(this.resMock.locals).to.deep.equal({
            investmentData,
            interaction: interactionTransformedFromApiData,
            form: {
              labels: interactionsLabels.edit,
              state: interactionTransformedFromApiData,
              options: {
                advisers: expectedAdvisors,
                contacts: investmentData.client_contacts,
                interactionTypes: expectedInteractionTypes,
                serviceTypes: expectedServiceTypes,
                teams: expectedTeams,
              },
            },
          })

          done()
        } catch (error) {
          done(error)
        }
      })
    })

    it('should set correct form data', (done) => {
      const expectedAdvisors = advisorData.results.map(transformToExpectedObject)
      const expectedServiceTypes = mockServices.map(transformToExpectedObject)
      const expectedTeams = metadataRepositoryStub.teams.map(transformToExpectedObject)
      const expectedInteractionTypes = metadataRepositoryStub.interactionTypeOptions.map(transformToExpectedObject)

      this.resMock.locals.investmentData = investmentData

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        try {
          expect(this.resMock.locals.form.labels).to.eql(interactionsLabels.edit)
          expect(this.resMock.locals.form.options.interactionTypes).to.deep.equal(expectedInteractionTypes)
          expect(this.resMock.locals.form.options.advisers).to.deep.equal(expectedAdvisors)
          expect(this.resMock.locals.form.options.contacts).to.deep.equal(investmentData.client_contacts)
          expect(this.resMock.locals.form.options.serviceTypes).to.deep.equal(expectedServiceTypes)
          expect(this.resMock.locals.form.options.teams).to.deep.equal(expectedTeams)
          expect(this.resMock.locals.investmentData).to.deep.equal(investmentData)
          done()
        } catch (error) {
          done(error)
        }
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

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/interactions', {
      '../../../../lib/metadata': metadataRepositoryStub,
      '../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateInteractionsFormMiddleware', () => {
    it('should call next with errors', (done) => {
      this.controller.populateForm({
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
