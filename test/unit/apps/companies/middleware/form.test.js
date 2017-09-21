const { populateForm } = require('~/src/apps/companies/middleware/form')

describe('Companies form middleware', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.nextSpy = this.sandbox.spy()
    this.reqMock = {}
    this.resMock = {
      locals: {},
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('populateForm()', () => {
    it('should include the required properties in the response', () => {
      populateForm(this.reqMock, this.resMock, this.nextSpy)

      expect(this.resMock.locals).to.have.property('regionOptions')
      expect(this.resMock.locals).to.have.property('sectorOptions')
      expect(this.resMock.locals).to.have.property('employeeOptions')
      expect(this.resMock.locals).to.have.property('turnoverOptions')
      expect(this.resMock.locals).to.have.property('headquarterOptions')
      expect(this.resMock.locals).to.have.property('hqLabels')
      expect(this.resMock.locals).to.have.property('companyDetailsLabels')
    })

    it('should call next with no arguments', () => {
      populateForm(this.reqMock, this.resMock, this.nextSpy)

      expect(this.nextSpy).to.be.calledWith()
    })
  })
})
