const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')

const { dnbCorp } = fixtures.company

describe('Company Investments and Large capital profile', () => {
  before(() => {
    cy.visit(`/companies/${dnbCorp.id}/investments/large-capital-profile`)
  })

  context('when the company does not have a profile', () => {
    it('should display a "Create a profile" button when the company does not have a "Large capital investor profile"', () => {
      cy.get(selectors.companyInvestment.createAProfile).should(
        'have.text',
        'Create a profile'
      )
    })
  })
})
