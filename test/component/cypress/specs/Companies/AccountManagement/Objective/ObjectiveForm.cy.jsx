import React from 'react'

import { faker } from '../../../../../../sandbox/utils.mjs'

import ObjectiveForm from '../../../../../../../src/client/modules/Companies/AccountManagement/Objective/ObjectiveForm'
import { companyFaker } from '../../../../../../functional/cypress/fakers/companies'
import {
  assertErrorSummary,
  assertBreadcrumbs,
  assertLink,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
  assertFieldDate,
  assertFieldInput,
} from '../../../../../../functional/cypress/support/assertions'
import { fill } from '../../../../../../functional/cypress/support/form-fillers'
import urls from '../../../../../../../src/lib/urls'
import { objectiveFaker } from '../../../../../../functional/cypress/fakers/objective'
import { transformAPIValuesForForm } from '../../../../../../../src/client/modules/Companies/AccountManagement/transformers'

const assertObjectiveBreadcrumbs = (company, objective) => {
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

describe('Objective form', () => {
  context('Validation checks', () => {
    beforeEach(() => {
      cy.mountWithProvider(<ObjectiveForm company={companyFaker()} />)
    })

    context(
      'When no fields are completed when a form is submitted the form',
      () => {
        it('should show an error message for all required fields', () => {
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
      it('should highlight an error with the date input', () => {
        fill('[data-test="subject-input"]', faker.word.adjective())
        fill('[data-test="target_date-day"]', '32')
        fill('[data-test="target_date-month"]', '18')
        fill('[data-test="target_date-year"]', '030')
        cy.get('[data-test="has-blocker-no"]').click()
        cy.get('[data-test="progress-50"]').click()
        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary(['Enter a valid target date'])

        cy.get('[data-test="field-target_date-error"]').contains(
          'Enter a valid target date'
        )
      })
    })
  })

  context('When the objective form does not have an objective item', () => {
    const company = companyFaker()
    beforeEach(() => {
      cy.mountWithProvider(<ObjectiveForm company={company} />)
    })

    assertObjectiveBreadcrumbs(company)

    it('should display the add objective heading', () => {
      cy.get('h1').contains(`Add objective for ${company.name}`)
    })

    it('should not display the Archive object button', () => {
      cy.get('a[data-test="archive-objective"]').should('not.exist')
    })

    it('should have a link back to the account account management page', () => {
      assertLink(
        'cancel-button',
        urls.companies.accountManagement.index(company.id)
      )
    })
  })

  context('When the objective form does have an objective item', () => {
    const objective = transformAPIValuesForForm(
      objectiveFaker({ progress: 75 })
    )

    beforeEach(() => {
      cy.mountWithProvider(
        <ObjectiveForm company={objective.company} objectiveItem={objective} />
      )
    })

    assertObjectiveBreadcrumbs(objective.company, objective)

    it('should display the add objective heading', () => {
      cy.get('h1').contains(`Edit objective for ${objective.company.name}`)
    })

    it('should not display the Archive object button', () => {
      assertLink(
        'archive-objective',
        urls.companies.accountManagement.objectives.archive(
          objective.company.id,
          objective.id
        )
      )
    })

    it('should have a link back to the account account management page', () => {
      assertLink(
        'cancel-button',
        urls.companies.accountManagement.index(objective.company.id)
      )
    })

    it('should display form fields with values matching the loaded objective', () => {
      cy.dataTest('field-subject').then((element) => {
        assertFieldInput({
          element,
          label: 'Objective subject',
          ignoreHint: true,
          value: objective.subject,
        })
      })

      cy.dataTest('field-detail').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Objective detail (optional)',
          ignoreHint: true,
          value: objective.detail,
        })
      })

      cy.get('[data-test="field-target_date"]').then((element) => {
        assertFieldDate({
          element,
          label: 'Target date',
          ignoreHint: true,
          value: objective.target_date,
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
          value: objective.blocker_description,
        })
      })

      cy.get('[data-test="field-progress"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'How close are we to achieving this objective at the moment?',
          optionsCount: 5,
          value: `${objective.progress}%`,
        })
      })
    })
  })
})
