const transformCompanyToAdditionalInformationView = require('~/src/apps/companies/transformers/company-to-additional-information-view')
const { additionalBusinessInformationLabels } = require('~/src/apps/companies/labels')

describe('#transformCompanyToAdditionalInformationView', () => {
  const commonTests = (expectedWebsites, expectedEmployees, expectedTurnover) => {
    it('should set the websites', () => {
      expect(this.actual[additionalBusinessInformationLabels.websites]).to.deep.equal(expectedWebsites)
    })

    it('should set the number of employees', () => {
      expect(this.actual[additionalBusinessInformationLabels.number_of_employees]).to.equal(expectedEmployees)
    })

    it('should set the turnover', () => {
      expect(this.actual[additionalBusinessInformationLabels.turnover]).to.equal(expectedTurnover)
    })
  }

  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToAdditionalInformationView({
        website: 'www.company.com',
        turnover: 100000,
        number_of_employees: 200,
      })
    })

    commonTests({
      url: 'www.company.com',
      name: 'www.company.com',
      hint: '(Opens in a new window)',
      hintId: 'external-link-label',
      newWindow: true,
    }, 200, 'USD 100000')
  })

  context('when no information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToAdditionalInformationView({
      })
    })

    commonTests('Not available', 'Not available', 'Not available')
  })
})
