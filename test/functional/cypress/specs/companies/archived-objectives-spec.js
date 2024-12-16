import {
  formatDate,
  DATE_FORMAT_COMPACT,
} from '../../../../../src/client/utils/date-utils'
import { objectiveFaker } from '../../fakers/objective'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id

const incompleteObjective = objectiveFaker({ archived: true, progress: 50 })
const completeObjective = objectiveFaker({ archived: true, progress: 100 })

context('When visiting the archived objective page with objectives', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
      results: [incompleteObjective, completeObjective],
    }).as('objectivesApi')
    cy.visit(urls.companies.accountManagement.objectives.archived(companyId))
    cy.wait('@objectivesApi')
  })

  it('should display an archived objective with correct completion status', () => {
    cy.get('[data-test="archived-objectives-row"]')
      .children()
      .children()
      .should('have.length', 2)
      .first()
      .should('contain.text', 'Objective incomplete')
      .next()
      .should('contain.text', 'Objective complete')
  })

  it('should display 2 archived objectives with correct details', () => {
    cy.get('[data-test="objective-1"]')
      .should('contain.text', incompleteObjective.detail)
      .should(
        'contain.text',
        formatDate(incompleteObjective.target_date, DATE_FORMAT_COMPACT)
      )
      .should('contain.text', incompleteObjective.progress)
      .should('contain.text', incompleteObjective.modifiedBy.name)
    cy.get('[data-test="objective-2"]')
      .should('contain.text', completeObjective.detail)
      .should(
        'contain.text',
        formatDate(completeObjective.target_date, DATE_FORMAT_COMPACT)
      )
      .should('contain.text', completeObjective.progress)
      .should('contain.text', completeObjective.modifiedBy.name)
  })
})

context('When visiting the archived objective page with no objectives', () => {
  before(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
      results: [],
    }).as('objectivesApi')
    cy.visit(urls.companies.accountManagement.objectives.archived(companyId))
    cy.wait('@objectivesApi')
  })

  it('should display no archived objectives message', () => {
    cy.get('[data-test="no-archived-objectives-row"]').should(
      'have.text',
      'There are no archived objectives for this company.'
    )
  })
})
