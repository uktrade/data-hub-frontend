import { companyFaker } from '../../fakers/companies'
import { objectiveFaker } from '../../fakers/objective'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id

const assertBreadcrumbs = (company) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Account management': null,
    })
  })
}

describe('Company account management', () => {
  const company = companyFaker({
    id: companyId,
  })

  const noBlockersObjective = objectiveFaker({ has_blocker: false })

  context(
    'When correctly adding required inputs for an objectives that has no blockers',
    () => {
      before(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
        cy.visit(urls.companies.accountManagement.objectives.create(companyId))
      })

      assertBreadcrumbs(fixtures.company.allActivitiesCompany)

      it('should display the add objective heading', () => {
        cy.get('h1').contains(`Add objective for ${company.name}`)
      })

      it('should contain all required form inputs', () => {
        cy.get('[data-test="subject-input"]')
          .click()
          .type(noBlockersObjective.subject)
        cy.get('[data-test="target_date-day"]').click().type('10')
        cy.get('[data-test="target_date-month"]').click().type('10')
        cy.get('[data-test="target_date-year"]').click().type('2030')
        cy.get('[data-test="has-blocker-no"]').click()
        cy.get('[data-test="progress-50"]').click()
        cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
          results: noBlockersObjective,
        })
        cy.get('[data-test="submit-button"]').click()
        cy.get('[data-test="status-message"]').contains('Objective saved')
      })
    }
  )
  context(
    'When no fields are completed when a form is submitted the form',
    () => {
      before(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
        cy.visit(urls.companies.accountManagement.objectives.create(companyId))
      })

      it('should highlight all required inputs', () => {
        cy.get('[data-test="submit-button"]').click()
        cy.get('[data-test="summary-form-errors"]')
          .children()
          .contains('There is a problem')
          .next()
          .children()
          .should('have.length', 4)
          .first()
          .contains('Enter a objective subject')
          .parent()
          .next()
          .contains('Enter a target date')
          .parent()
          .next()
          .contains('Select if there are any blockers')
          .parent()
          .next()
          .contains('Select a percentage')
      })
    }
  )
  context('When an incorrect date is submitted', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })
    it('should highlight an error with the date input', () => {
      cy.get('[data-test="subject-input"]')
        .click()
        .type(noBlockersObjective.subject)
      cy.get('[data-test="target_date-day"]').click().type('32')
      cy.get('[data-test="target_date-month"]').click().type('18')
      cy.get('[data-test="target_date-year"]').click().type('030')
      cy.get('[data-test="has-blocker-no"]').click()
      cy.get('[data-test="progress-50"]').click()
      cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
        results: noBlockersObjective,
      })
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"]')
        .children()
        .contains('There is a problem')
        .next()
        .children()
        .should('have.length', 1)
        .first()
        .contains('Enter a valid target date')
    })
  })
  context('When adding an objective with blockers', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })
    it('clicking yes to blocker should reveal a text area to enable blocker to be captured', () => {
      cy.get('[data-test="subject-input"]')
        .click()
        .type(noBlockersObjective.subject)
      cy.get('[data-test="target_date-day"]').click().type('3')
      cy.get('[data-test="target_date-month"]').click().type('1')
      cy.get('[data-test="target_date-year"]').click().type('2030')
      cy.get('[data-test="has-blocker-no"]').click()
      cy.get('[data-test="field-blocker_description"]').should('not.exist')
      cy.get('[data-test="has-blocker-yes"]').click()
      cy.get('[data-test="field-blocker_description"]')
        .should('exist')
        .click()
        .type('Blocker words')
      cy.get('[data-test="progress-25"]').click()
      cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
        results: noBlockersObjective,
      })
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="status-message"]').contains('Objective saved')
    })
  })
  context('When clicking the back link', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })
    it('should link back to the account account management page', () => {
      cy.get('[data-test="cancel-button"]').click()
      cy.get('[data-test="heading"]').contains(company.name)
    })
  })
})
