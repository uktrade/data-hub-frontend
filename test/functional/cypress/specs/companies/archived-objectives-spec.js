import { objectiveFaker } from '../../fakers/objective'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id

const incompleteObjective = objectiveFaker({ archived: true, progress: 50 })
const completeObjective = objectiveFaker({ archived: true, progress: 100 })

context('When visiting the archived objective page with objectives', () => {
  before(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
      results: [incompleteObjective, completeObjective],
    }).as('objectivesApi')
    cy.visit(urls.companies.accountManagement.objectives.archived(companyId))
    cy.wait('@objectivesApi')
  })

  it('should display an archived objective with correct progress', () => {
    cy.get('[data-test="archived-objectives-row"]')
      .children()
      .children()
      .should('have.length', 2)
      .first()
      .should('contain.text', 'Objective incomplete')
      .next()
      .should('contain.text', 'Objective complete')
  })

  xit('should display an archived objective with correct details', () => {
    cy.get('[data-test="archived-objectives-row"]')
      .children()
      .children()
      .should('contain.text', incompleteObjective.target_date)
  })
})
