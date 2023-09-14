import { format } from '../../../../../src/client/utils/date'
import { DATE_LONG_FORMAT_3 } from '../../../../../src/common/constants'
import { companyFaker } from '../../fakers/companies'
import { objectiveFaker } from '../../fakers/objective'

const {
  assertErrorSummary,
  assertPayload,
  assertFieldDateShort,
  assertFieldInput,
  assertFieldTextarea,
  assertFieldDate,
  assertFieldRadiosWithLegend,
} = require('../../support/assertions')

const { fill } = require('../../../../functional/cypress/support/form-fillers')

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id
const noBlockersObjective = objectiveFaker({ has_blocker: false })
const withBlockersObjective = objectiveFaker({ progress: 75 })

const assertBreadcrumbs = (company, objective) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Account management': urls.companies.accountManagement.index(company.id),
      [objective
        ? `Edit ${objective.subject}`
        : `Add objective for ${company.name}`]: null,
    })
  })
}

describe('Company account management', () => {
  const company = companyFaker({
    id: companyId,
  })

  context('When visiting the add objective page', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`, company)
      cy.visit(urls.companies.accountManagement.objectives.create(companyId))
    })

    assertBreadcrumbs(fixtures.company.allActivitiesCompany)

    it('should display the add objective heading', () => {
      cy.get('h1').contains(`Add objective for ${company.name}`)
    })

    it('should not display the Archive object button', () => {
      cy.get('a[data-test="archive-objective"]').should('not.exist')
    })
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
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary(['Enter a valid target date'])
      assertFieldDateShort
      cy.get('[data-test="field-target_date-error"]').contains(
        'Enter a valid target date'
      )
    })
  })

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

    assertBreadcrumbs(
      fixtures.company.allActivitiesCompany,
      withBlockersObjective
    )

    it('should display the add objective heading', () => {
      cy.get('h1').contains(
        `Edit objective for ${withBlockersObjective.company.name}`
      )
    })

    it('should display form fields with values matching the loaded objective', () => {
      cy.dataTest('field-subject').then((element) => {
        assertFieldInput({
          element,
          label: 'Objective subject',
          ignoreHint: true,
          value: withBlockersObjective.subject,
        })
      })

      cy.dataTest('field-detail').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Objective detail (optional)',
          ignoreHint: true,
          value: withBlockersObjective.detail,
        })
      })

      cy.get('[data-test="field-target_date"]').then((element) => {
        assertFieldDate({
          element,
          label: 'Target date',
          ignoreHint: true,
          value: withBlockersObjective.target_date,
        })
      })

      cy.get('[data-test="field-has_blocker"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Are there any blockers to achieving this objective?',
          optionsCount: 2,
          value: 'Yes',
        })
      })

      cy.dataTest('field-blocker_description').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Blocker description',
          ignoreHint: true,
          value: withBlockersObjective.blocker_description,
        })
      })

      cy.get('[data-test="field-progress"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'How close are we to achieving this objective at the moment?',
          optionsCount: 5,
          value: `${withBlockersObjective.progress}%`,
        })
      })
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
        target_date: format(
          withBlockersObjective.target_date.toISOString(),
          DATE_LONG_FORMAT_3
        ),
      })
    })

    it('should display the Archive object button', () => {
      cy.get('a[data-test="archive-objective"]').should(
        'have.attr',
        'href',
        urls.companies.accountManagement.objectives.archive(
          withBlockersObjective.company.id,
          withBlockersObjective.id
        )
      )
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
      cy.get('button[data-test="submit-button"]').click()
      cy.wait('@getWithBlockersObjectives')

      cy.get('[data-test="status-message"]').contains('Objective archived')
    })
  })
})
