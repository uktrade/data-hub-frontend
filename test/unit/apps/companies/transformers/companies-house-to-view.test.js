const companiesHouseCompany = require('~/test/unit/data/companies/companies-house.json')
const transformCompaniesHouseToView = require('~/src/apps/companies/transformers/companies-house-to-view')

describe('transformCompaniesHouseToView', () => {
  context('when companies data is provided', () => {
    beforeEach(() => {
      this.viewRecord = transformCompaniesHouseToView(companiesHouseCompany)
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
      expect(this.viewRecord).to.have.property('Registered name', 'Mercury Trading Ltd')
    })

    it('should return the company number', () => {
      expect(this.viewRecord).to.have.property('Companies House No', '99919')
    })

    it('should return the business type', () => {
      expect(this.viewRecord).to.have.property('Company type', 'Private Limited Company')
    })

    it('should return the company status', () => {
      expect(this.viewRecord).to.have.property('Company status', 'Active')
    })

    it('should return the registered address', () => {
      expect(this.viewRecord['Registered office address']).to.deep.equal({
        type: 'address',
        address: {
          line_1: '64 Ermin Street',
          line_2: '',
          town: 'Y Ffor',
          county: '',
          postcode: 'LL53 5RN',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should return the incorporation date', () => {
      expect(this.viewRecord).to.have.property('Incorporated on', '14 December 2000')
    })

    it('should return the formatted SIC codes', () => {
      expect(this.viewRecord).to.have.property(
        'Nature of business (SIC)',
        '82990 - Other business support service activities n.e.c., more stuff'
      )
    })
  })
})
