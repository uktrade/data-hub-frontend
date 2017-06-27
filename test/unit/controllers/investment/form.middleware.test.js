const interactionTransformedFromApiData = require('~/test/unit/data/investment/interaction/interaction-transformed-from-api.json')
const investmentProjectData = require('~/test/unit/data/investment/project-summary.json')
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

  describe('#populateValueFormMiddleware', () => {
    it('should set form labels', () => {
      this.controller.populateValueFormMiddleware({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals.form.labels).to.be.an('object').that.has.keys([
        'average_salary',
        'client_cannot_provide_foreign_investment',
        'client_cannot_provide_total_investment',
        'export_revenue',
        'foreign_equity_investment',
        'government_assistance',
        'new_tech_to_uk',
        'non_fdi_r_and_d_budget',
        'number_new_jobs',
        'number_safeguarded_jobs',
        'r_and_d_budget',
        'total_investment',
      ])
      expect(this.nextSpy.calledOnce).to.be.true
    })

    it('should set form state', () => {
      this.resMock.locals.valueData = {
        average_salary: {
          id: 'abcd',
        },
      }
      this.controller.populateValueFormMiddleware({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals.form.state.average_salary).to.equal('abcd')
      expect(this.nextSpy.calledOnce).to.be.true
    })

    it('should set form options (dropdown)', () => {
      this.controller.populateValueFormMiddleware({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals.form.options.averageSalaryRange).to.deep.include({ id: '1', name: 'Below 10k' })
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('#populateInteractionsFormMiddleware', () => {
    it('should call next', (done) => {
      const mockAdviser = advisorData.results[0]
      const expectedAdvisors = [
        { id: mockAdviser.id, name: mockAdviser.name },
      ]

      this.resMock.locals.projectData = investmentProjectData
      this.resMock.locals.interaction = interactionTransformedFromApiData

      this.controller.populateInteractionsFormMiddleware({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals).to.deep.equal({
          projectData: investmentProjectData,
          interaction: interactionTransformedFromApiData,
          form: {
            labels: interactionsLabels.edit,
            state: interactionTransformedFromApiData,
            options: {
              advisers: expectedAdvisors,
              contacts: investmentProjectData.client_contacts,
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

      this.resMock.locals.projectData = investmentProjectData

      this.controller.populateInteractionsFormMiddleware({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.labels).to.eql(interactionsLabels.edit)
        expect(this.resMock.locals.form.options.interactionTypes).to.deep.equal(metadataRepositoryStub.interactionTypeOptions)
        expect(this.resMock.locals.form.options.advisers).to.deep.equal(expectedAdvisors)
        expect(this.resMock.locals.form.options.contacts).to.deep.equal(investmentProjectData.client_contacts)
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
