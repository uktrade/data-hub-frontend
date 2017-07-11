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

describe('Investment form middleware - investment value', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().resolves(advisorData)
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {},
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/value', {
      '../../../../lib/metadata': metadataRepositoryStub,
      '../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should set form labels', () => {
    this.controller.populateForm({}, this.resMock, this.nextSpy)

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
    this.resMock.locals.investmentData = {
      average_salary: {
        id: 'abcd',
      },
    }
    this.controller.populateForm({}, this.resMock, this.nextSpy)

    expect(this.resMock.locals.form.state.average_salary).to.equal('abcd')
    expect(this.nextSpy.calledOnce).to.be.true
  })

  it('should set form options (dropdown)', () => {
    this.controller.populateForm({}, this.resMock, this.nextSpy)

    expect(this.resMock.locals.form.options.averageSalaryRange).to.deep.include({ id: '1', name: 'Below 10k' })
    expect(this.nextSpy.calledOnce).to.be.true
  })
})
