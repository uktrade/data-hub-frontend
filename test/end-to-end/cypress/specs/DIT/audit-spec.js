const selectors = require('../../../../selectors')

describe('contact', () => {
  const todaysDate = Cypress.moment().format('DD MMM YYYY')

  before(() => {
    cy.visit('/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/edit')
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyAudit.save).click()
    cy.visit('/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/audit')

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
  })
})
