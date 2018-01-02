const moment = require('moment')

const config = require('~/config')
const adviserData = require('~/test/unit/data/investment/interaction/advisers')
const controller = require('~/src/apps/investment-projects/middleware/forms/value')

const yesterday = moment().subtract(1, 'days').toISOString()
const lastMonth = moment().subtract(1, 'months').toISOString()

const metadataMock = {
  salaryRangeOptions: [
    { id: '1', name: 'sr1', disabled_on: null },
    { id: '2', name: 'sr2', disabled_on: yesterday },
    { id: '3', name: 'sr3', disabled_on: null },
  ],
  fdiTypeOptions: [
    { id: '1', name: 'f1', disabled_on: null },
    { id: '2', name: 'f2', disabled_on: yesterday },
    { id: '3', name: 'f3', disabled_on: null },
  ],
}

describe('Investment form middleware - investment value', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()

    this.reqMock = {
      session: {
        token: '1234',
      },
    }

    this.resMock = {
      locals: {},
    }

    this.nockScope = nock(config.apiRoot)
      .get(`/adviser/?limit=100000&offset=0`)
      .reply(200, adviserData)
      .get('/metadata/salary-range/')
      .reply(200, metadataMock.salaryRangeOptions)
      .get('/metadata/fdi-type/')
      .reply(200, metadataMock.fdiTypeOptions)
  })

  describe('#populateForm', () => {
    context('when called for a new form', () => {
      beforeEach(async () => {
        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('create an empty state object', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          average_salary: undefined,
        })
      })

      it('should include active salary range options', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.averageSalaryRange).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(expectedOptions)
      })
    })

    context('when called for an investment created in the past', () => {
      beforeEach(async () => {
        this.resMock.locals.investmentData = {
          id: '1234',
          created_on: lastMonth,
        }

        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('create state object with investment data', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          id: '1234',
          created_on: lastMonth,
          average_salary: undefined,
        })
      })

      it('should include active salary range options last month', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr2', value: '2' },
          { label: 'sr3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.averageSalaryRange).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options last month', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f2', value: '2' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(expectedOptions)
      })
    })

    context('when called after a previous post failed', () => {
      beforeEach(async () => {
        this.resMock.locals = {
          investmentData: {
            id: '1234',
            created_on: lastMonth,
            name: 'original name',
          },
          form: {
            errors: ['an error'],
            state: {
              name: 'modified name',
            },
          },
        }

        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('should combine investment data with form data to produce state', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          id: '1234',
          created_on: lastMonth,
          average_salary: undefined,
          name: 'modified name',
        })
      })

      it('should pass through errors', () => {
        expect(this.resMock.locals.form.errors).to.deep.equal(['an error'])
      })

      it('should include active salary range options last month', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr2', value: '2' },
          { label: 'sr3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.averageSalaryRange).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options last month', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f2', value: '2' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(expectedOptions)
      })
    })
  })
})
