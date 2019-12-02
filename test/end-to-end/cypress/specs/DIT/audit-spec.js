const selectors = require('../../../../selectors')

const todaysDate = Cypress.moment().format('D MMM YYYY')

describe('Company', () => {
  before(() => {
    cy.visit('/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/edit')
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyAudit.save).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit('/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/audit')

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
  })
})

describe('Contact', () => {
  before(() => {
    cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/edit')
  })

  it('should display name of the person who made contact record changes', () => {
    cy.get(selectors.contactCreate.save).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/audit')

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
  })
})
