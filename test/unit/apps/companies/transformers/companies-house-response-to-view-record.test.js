const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const transformCompaniesHouseResponseToViewRecord = require('~/src/apps/companies/transformers/companies-house-response-to-view-record')

describe('transformCompaniesHouseResponseToViewRecord', () => {
  context('when companies data is provided', () => {
    beforeEach(() => {
      this.viewRecord = transformCompaniesHouseResponseToViewRecord(companiesHouseCompany.companies_house_data)
    })

    it('should return the fields expected in the correct order', () => {
      expect(this.viewRecord).to.have.ordered.keys([
        'Registered name',
        'Companies House No',
        'Company type',
        'Company status',
        'Registered office address',
        'Incorporated on',
        'Nature of business (SIC)',
      ])
    })

    it('should return the name', () => {
      expect(this.viewRecord).to.have.property('Registered name', 'Samsung Bioepis Uk Limited')
    })

    it('should return the company number', () => {
      expect(this.viewRecord).to.have.property('Companies House No', '08840722')
    })

    it('should return the business type', () => {
      expect(this.viewRecord).to.have.property('Company type', 'Private Limited Company')
    })

    it('should return the company status', () => {
      expect(this.viewRecord).to.have.property('Company status', 'Active')
    })

    it('should return the registered address', () => {
      expect(this.viewRecord).to.have.property('Registered office address', '5th Floor, Profile West, 950 Great West Road, Brentford, Middlesex, TW8 9ES, United Kingdom')
    })

    it('should return the incorporation date', () => {
      expect(this.viewRecord).to.have.property('Incorporated on', '10 January 2014')
    })

    it('should return the formatted SIC codes', () => {
      expect(this.viewRecord).to.have.property('Nature of business (SIC)', '82990 - Other business support service activities n.e.c., more stuff')
    })
  })
})
