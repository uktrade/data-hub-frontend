const transformCompanyToKnownAsView = require('~/src/apps/companies/transformers/company-to-known-as-view')

describe('#transformCompanyToKnownAsView', () => {
  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToKnownAsView({
        trading_name: 'trading name',
        companies_house_data: {
          company_number: '123456',
        },
      })
    })

    it('should set the trading name', () => {
      expect(this.actual['Trading name']).to.equal('trading name')
    })

    it('should set the Companies House number', () => {
      expect(this.actual['Companies House number'][0]).to.equal('123456')
    })

    it('should set the Companies House link', () => {
      expect(this.actual['Companies House number'][1]).to.deep.equal({
        url: 'https://beta.companieshouse.gov.uk/company/123456',
        name: 'View on Companies House website',
        hint: '(Opens in a new window)',
        hintId: 'external-link-label',
        newWindow: true,
      })
    })
  })

  context('when no information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToKnownAsView({})
    })

    it('should set the trading name to "None"', () => {
      expect(this.actual['Trading name']).to.equal('None')
    })

    it('should not set the Companies House number', () => {
      expect(this.actual['Companies House number']).be.undefined
    })
  })
})
