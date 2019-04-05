const company = require('~/test/unit/data/companies/company-v4.json')
const companiesHouseRecord = require('~/test/unit/data/companies/companies-house.json')

describe('Companies form middleware', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.getDitCompanyStub = sinon.stub()
    this.getCHCompanyStub = sinon.stub()
    this.reqMock = { query: {}, session: { token: 2 } }
    this.resMock = { locals: {} }

    this.middleware = proxyquire('~/src/apps/companies/middleware/params.js', {
      '../repos': {
        getDitCompany: this.getDitCompanyStub,
        getCHCompany: this.getCHCompanyStub,
      },
    })
  })

  describe('getCompany', () => {
    beforeEach(async () => {
      this.getDitCompanyStub.resolves(company)
      await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, 2)
    })

    it('should return the company', () => {
      expect(this.resMock.locals).to.have.deep.property('company', company)
    })
  })

  describe('getCompaniesHouseRecord', () => {
    context('when the API returns a companies house record', async () => {
      beforeEach(async () => {
        this.getCHCompanyStub.resolves(companiesHouseRecord)
        await this.middleware.getCompaniesHouseRecord(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should return the companies house record', () => {
        expect(this.resMock.locals).to.have.deep.property('companiesHouseRecord', companiesHouseRecord)
      })

      it('should return the companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', 'Private Limited Company')
      })
    })
  })
})
