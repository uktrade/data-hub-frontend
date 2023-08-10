import { companyFaker } from '../../fakers/companies'
import { objectiveFaker } from '../../fakers/objective'

const {
  assertErrorSummary,
  assertPayload,
} = require('../../support/assertions')

const { fill } = require('../../../../functional/cypress/support/form-fillers')

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
        fill('[data-test="subject-input"]', noBlockersObjective.subject)
        fill('[data-test="target_date-day"]', '10')
        fill('[data-test="target_date-month"]', '10')
        fill('[data-test="target_date-year"]', '2030')
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
        cy.visit(urls.companies.accountManagement.objectives.create(companyId))
      })

      it('should highlight all required inputs', () => {
        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary([
          'Enter an objective subject',
          'Enter a target date',
          'Select if there are any blockers',
          'Select a percentage',
        ])
      })
    }
  )
  context('When an incorrect date is submitted', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })
    it('should highlight an error with the date input', () => {
      fill('[data-test="subject-input"]', noBlockersObjective.subject)
      fill('[data-test="target_date-day"]', '32')
      fill('[data-test="target_date-month"]', '18')
      fill('[data-test="target_date-year"]', '030')
      cy.get('[data-test="has-blocker-no"]').click()
      cy.get('[data-test="progress-50"]').click()
      cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
        results: noBlockersObjective,
      }).as('postObjectiveApiRequest')
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary(['Enter a valid target date'])
      cy.get('[data-test="field-target_date-error"]').contains(
        'Enter a valid target date'
      )
    })
  })
  context('When adding all objective fields including with blockers', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })
    it('clicking yes to blocker should reveal a text area to enable blocker to be captured', () => {
      fill('[data-test="subject-input"]', noBlockersObjective.subject)
      fill('[data-test="detail-input"]', noBlockersObjective.detail)
      fill('[data-test="target_date-day"]', '3')
      fill('[data-test="target_date-month"]', '1')
      fill('[data-test="target_date-year"]', '2020')
      cy.get('[data-test="has-blocker-no"]').click()
      cy.get('[data-test="field-blocker_description"]').should('not.exist')
      cy.get('[data-test="has-blocker-yes"]').click()
      cy.get('[data-test="field-blocker_description"]')
        .should('exist')
        .click()
        .type(noBlockersObjective.blocker_description)
      cy.get('[data-test="progress-25"]').click()
      cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
        results: noBlockersObjective,
      }).as('postObjectiveApiRequest')
      cy.get('[data-test="submit-button"]').click()
      assertPayload('@postObjectiveApiRequest', {
        subject: noBlockersObjective.subject,
        detail: noBlockersObjective.detail,
        company: companyId,
        target_date: '2020-01-03',
        has_blocker: true,
        blocker_description: noBlockersObjective.blocker_description,
        progress: 25,
      })
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
