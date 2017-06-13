const metadataRepositoryStub = {
  salaryRangeOptions: [
    { id: '1', name: 'Below 10k' },
    { id: '2', name: 'Above 10k' },
  ],
}

describe('Investment form middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.controller = proxyquire('~/src/controllers/investment/form.middleware', {
      '../../repos/metadata.repo': metadataRepositoryStub,
    })
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {},
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateValueFormMiddleware', () => {
    it('should set form labels', () => {
      this.controller.populateValueFormMiddleware({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals.form.labels).to.be.an('object').that.has.keys([
        'average_salary',
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
})
