const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
const companiesHouseRecord = require('~/test/unit/data/companies/companies-house.json')

describe('Companies form middleware', function () {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.getDitCompanyStub = sandbox.stub()
    this.getCHCompanyStub = sandbox.stub()
    this.reqMock = { query: {}, session: { token: 2 } }
    this.resMock = { locals: {} }

    this.middleware = proxyquire('~/src/apps/companies/middleware/params.js', {
      '../repos': {
        getDitCompany: this.getDitCompanyStub,
        getCHCompany: this.getCHCompanyStub,
      },
      '../transformers/shared': {
        getCompanyAddress: sandbox.stub().returns({
          label: 'label',
          value: 'address',
        }),
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getCompany', () => {
    context('when the API returns a company without companies house data', () => {
      beforeEach(async () => {
        this.getDitCompanyStub.resolves(datahubOnlyCompany)
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should return the company', () => {
        expect(this.resMock.locals).to.have.deep.property('company', datahubOnlyCompany)
      })

      it('should return the company address', () => {
        expect(this.resMock.locals).to.have.property('headingAddress', 'address')
      })

      it('should have a null companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', undefined)
      })
    })

    context('when the API returns a company with companies house data', () => {
      beforeEach(async () => {
        this.getDitCompanyStub.resolves(companiesHouseCompany)
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should return the company', () => {
        expect(this.resMock.locals).to.have.deep.property('company', companiesHouseCompany)
      })

      it('should return the company address', () => {
        expect(this.resMock.locals).to.have.property('headingAddress', 'address')
      })

      it('should have a null companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', 'Private Limited Company')
      })
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
