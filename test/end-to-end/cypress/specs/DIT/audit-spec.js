const selectors = require('../../../../selectors')

const urls = require('../../../../../src/lib/urls')

const todaysDate = Cypress.moment().format('D MMM YYYY')

describe('Company', () => {
  before(() => {
    cy.visit(urls.companies.edit('0f5216e0-849f-11e6-ae22-56b6b6499611'))
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyEdit.saveButton).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(
      urls.companies.editHistory.index('0f5216e0-849f-11e6-ae22-56b6b6499611')
    )

    cy.get(selectors.companyEditHistory.change(1).updated)
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')

    cy.get(selectors.companyEditHistory.change(1).noChanges).should(
      'have.text',
      'No changes were made to business details in this update'
    )
  })
})

describe('Contact', () => {
  before(() => {
    cy.visit(urls.contacts.edit('9b1138ab-ec7b-497f-b8c3-27fed21694ef'))
  })

  it('should display name of the person who made contact record changes', () => {
    cy.get(selectors.contactCreate.save).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.contacts.audit('9b1138ab-ec7b-497f-b8c3-27fed21694ef'))

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
  })
})
