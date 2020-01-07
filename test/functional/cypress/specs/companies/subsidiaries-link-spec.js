const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Companies link a subsidiary', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.oneListCorp.id}/subsidiaries`)
  })

  it('should link a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiary).click()

    cy.get(selectors.companySubsidiariesLink().search.term).type('lambda')
    cy.get(selectors.companySubsidiariesLink().search.button).click()
    cy.get(selectors.companySubsidiariesLink().search.result(1).title).click()

    cy.get(selectors.localHeader().flash).should(
      'contain',
      'You’ve linked the subsidiary'
    )
  })
})
