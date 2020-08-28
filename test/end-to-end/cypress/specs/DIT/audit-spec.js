const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const todaysDate = Cypress.moment().format('D MMM YYYY')

describe('Company', () => {
  before(() => {
    cy.visit(urls.companies.edit(fixtures.company.venusLtd.id))
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyEdit.website)
      .clear()
      .type('www.example.com')

    cy.get(selectors.companyEdit.saveButton).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.companies.editHistory.index(fixtures.company.venusLtd.id))

    cy.get(selectors.editHistory.change(1).updated)
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')
  })
})

describe('Contact', () => {
  before(() => {
    cy.visit(urls.contacts.edit(fixtures.contact.johnnyCakeman.id))
  })

  it('should display name of the person who made contact record changes', () => {
    cy.get(selectors.contactCreate.save).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.contacts.audit(fixtures.contact.johnnyCakeman.id))

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
  })
})

describe('Investment Project', () => {
  before(() => {
    cy.visit(
      urls.investments.projects.editDetails(
        fixtures.investmentProject.newZoo.id
      )
    )
  })

  it('should display name of the person who made investment project record changes', () => {
    cy.get(selectors.investment.form.saveButton).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(
      urls.investments.editHistory.index(fixtures.investmentProject.newZoo.id)
    )

    cy.get(selectors.editHistory.change(1).updated)
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')

    cy.get(selectors.editHistory.change(1).noChanges).should(
      'have.text',
      'No changes were made to the project in this update'
    )
  })
})
