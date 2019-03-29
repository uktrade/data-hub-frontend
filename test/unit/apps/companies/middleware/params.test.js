const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
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
      '../transformers/shared': {
        getCompanyAddress: sinon.stub().returns({
          label: 'label',
          value: 'address',
        }),
      },
    })
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

      it('should have a null companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', undefined)
      })

      it('should have a ehq metaItems', () => {
        expect(this.resMock.locals).to.have.deep.property('metaItems', [
          {
            type: 'badge',
            label: 'Headquarter type',
            value: 'European HQ',
          },
        ])
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

      it('should have a null companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', 'Private Limited Company')
      })

      it('should have a ehq metaItems', () => {
        expect(this.resMock.locals).to.have.deep.property('metaItems', [
          {
            type: 'badge',
            label: 'Headquarter type',
            value: 'European HQ',
          },
        ])
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
