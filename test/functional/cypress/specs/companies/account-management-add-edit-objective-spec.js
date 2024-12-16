import {
  formatDate,
  DATE_FORMAT_ISO,
} from '../../../../../src/client/utils/date-utils'
import { companyFaker } from '../../fakers/companies'
import { objectiveFaker } from '../../fakers/objective'
import { clickButton } from '../../support/actions'

const {
  assertPayload,
  assertFlashMessage,
} = require('../../support/assertions')

const { fill } = require('../../../../functional/cypress/support/form-fillers')

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id
const noBlockersObjective = objectiveFaker({ has_blocker: false })
const withBlockersObjective = objectiveFaker({ progress: 75 })

describe('Company account management', () => {
  const company = companyFaker({
    id: companyId,
  })

  context(
    'When correctly adding required inputs for an objectives that has no blockers',
    () => {
      before(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company).as(
          'getAddObjective'
        )
        cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
          results: noBlockersObjective,
        }).as('postObjectiveApiRequest')
        cy.visit(urls.companies.accountManagement.objectives.create(companyId))
        cy.wait('@getAddObjective')
      })

      it('should submit with the minimum amount of data', () => {
        fill('[data-test="subject-input"]', noBlockersObjective.subject)
        fill('[data-test="target_date-day"]', '10')
        fill('[data-test="target_date-month"]', '10')
        fill('[data-test="target_date-year"]', '2030')
        cy.get('[data-test="has-blocker-no"]').click()
        cy.get('[data-test="progress-50"]').click()
        cy.get('[data-test="submit-button"]').click()
        cy.wait('@postObjectiveApiRequest')
        cy.get('[data-test="status-message"]').contains('Objective saved')
      })
    }
  )

  context('When adding all objective fields including with blockers', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.intercept('POST', `/api-proxy/v4/company/${companyId}/objective`, {
        results: noBlockersObjective,
      }).as('postObjectiveApiRequest')
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })

    it('should reveal a text area to enable a blocker description to be captured', () => {
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

  context('When visiting the edit objective page', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company/${withBlockersObjective.company.id}/objective/${withBlockersObjective.id}`,
        withBlockersObjective
      )
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/company/${withBlockersObjective.company.id}/objective/${withBlockersObjective.id}`,
        {}
      ).as('patchObjectiveApiRequest')
      cy.visit(
        urls.companies.accountManagement.objectives.edit(
          withBlockersObjective.company.id,
          withBlockersObjective.id
        )
      )
    })

    it('should submit the form with updated values', () => {
      cy.get('[data-test=submit-button]').click()

      assertPayload('@patchObjectiveApiRequest', {
        company: withBlockersObjective.company.id,
        blocker_description: withBlockersObjective.blocker_description,
        detail: withBlockersObjective.detail,
        has_blocker: withBlockersObjective.has_blocker,
        progress: withBlockersObjective.progress,
        subject: withBlockersObjective.subject,
        target_date: formatDate(
          withBlockersObjective.target_date,
          DATE_FORMAT_ISO
        ),
      })
    })
  })

  context('When archiving an objective', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company/${withBlockersObjective.company.id}/objective/${withBlockersObjective.id}`,
        withBlockersObjective
      ).as('getWithBlockersObjectives')
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/company/${withBlockersObjective.company.id}/objective/${withBlockersObjective.id}/archive`,
        {}
      ).as('patchArchiveObjectiveApiRequest')
      cy.intercept(
        'POST',
        `/api-proxy/v4/company/objective/${withBlockersObjective.id}/archive`,
        {}
      ).as('postArchiveObjectiveApiRequest')
    })

    it('should after archiving redirect to the account management page and display Flash message', () => {
      cy.visit(
        urls.companies.accountManagement.objectives.archive(
          withBlockersObjective.company.id,
          withBlockersObjective.id
        )
      )
      clickButton('Archive objective')
      cy.wait('@getWithBlockersObjectives')

      assertFlashMessage('Objective archived')
    })
  })
})
