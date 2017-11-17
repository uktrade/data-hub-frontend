const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company')

describe('Companies form middleware', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.getDitCompanyStub = this.sandbox.stub().resolves({})
    this.getCHCompanyStub = this.sandbox.stub().resolves(companiesHouseCompany)
    this.reqMock = { query: {}, session: { token: 2 } }
    this.resMock = { locals: {} }
    this.middleware = proxyquire('~/src/apps/companies/middleware/params.js', {
      '../repos': {
        getCHCompany: (token, number) => this.getCHCompanyStub(token, number),
        getDitCompany: (token, id) => this.getDitCompanyStub(token, id),
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getCompany', () => {
    it('should handle non-companies house companies when setting category', () => {
      this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, 2)
      expect(this.resMock.locals.companiesHouseCategory).to.equal(undefined)
    })

    it('should handle companies house companies when setting category', done => {
      const next = () => {
        expect(this.resMock.locals.companiesHouseCategory).to.equal('Limited company')
        done()
      }
      this.getDitCompanyStub = this.sandbox.stub().resolves({
        companies_house_data: {
          company_category: 'Limited company',
        },
      })
      this.middleware.getCompany(this.reqMock, this.resMock, next, 2)
    })
  })

  describe('getCompaniesHouseRecord', () => {
    it('should handle non-companies house companies when setting category', () => {
      this.middleware.getCompaniesHouseRecord(this.reqMock, this.resMock, this.nextSpy, 2)
      expect(this.resMock.locals.companiesHouseCategory).to.equal(undefined)
    })

    it('should handle companies house companies when setting category', done => {
      const next = () => {
        expect(this.resMock.locals.companiesHouseCategory).to.equal('Limited company')
        done()
      }
      this.getCHCompanyStub = this.sandbox.stub().resolves({
        company_category: 'Limited company',
      })
      this.middleware.getCompaniesHouseRecord(this.reqMock, this.resMock, next, 2)
    })
  })
})
