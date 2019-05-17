const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors/index.js')

describe('Companies link a subsidiary', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.oneListCorp.id}/subsidiaries`)
  })

  it('should link a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiary).click()

    cy.get(selectors.companySubsidiariesLink().search.term).type('lambda')
    cy.get(selectors.companySubsidiariesLink().search.button).click()
    cy.get(selectors.companySubsidiariesLink().search.result(1).title).click()

    cy.get(selectors.companySubsidiaries().flash.success).should('contain', 'You’ve linked the subsidiary')
  })
})
