const transformCompanyToAboutView = require('~/src/apps/companies/transformers/company-to-about-view')
const { aboutLabels } = require('~/src/apps/companies/labels')
const { NONE_TEXT, NOT_AVAILABLE_TEXT } = require('~/src/apps/companies/constants')

describe('#transformCompanyToKnownAsView', () => {
  const commonTests = (expectedTradingNames, expectedWebsite, expectedEmployees, expectedTurnover) => {
    it('should set the trading name', () => {
      expect(this.actual[aboutLabels.trading_names]).to.deep.equal(expectedTradingNames)
    })

    it('should set the website', () => {
      expect(this.actual[aboutLabels.website]).to.deep.equal(expectedWebsite)
    })

    it('should set the number of employees', () => {
      expect(this.actual[aboutLabels.number_of_employees]).to.equal(expectedEmployees)
    })

    it('should set the turnover', () => {
      expect(this.actual[aboutLabels.turnover]).to.equal(expectedTurnover)
    })
  }

  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToAboutView({
        trading_names: [
          'trading name 1',
          'trading name 2',
        ],
        companies_house_data: {
          company_number: '123456',
        },
        website: 'www.company.com',
        turnover: 100000,
        number_of_employees: 200,
      })
    })

    commonTests(
      [
        'trading name 1',
        'trading name 2',
      ],
      {
        url: 'www.company.com',
        name: 'www.company.com',
        hint: '(Opens in a new window)',
        hintId: 'external-link-label',
        newWindow: true,
      },
      200,
      'USD 100000'
    )

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
      this.actual = transformCompanyToAboutView({})
    })

    commonTests(
      NONE_TEXT,
      NOT_AVAILABLE_TEXT,
      NOT_AVAILABLE_TEXT,
      NOT_AVAILABLE_TEXT,
    )

    it('should not set the Companies House number', () => {
      expect(this.actual['Companies House number']).be.undefined
    })
  })
})
