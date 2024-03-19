import { formFields, supportProvidedStep } from './constants'
import { clickContinueButton } from '../../support/actions'

import {
  assertFieldError,
  assertErrorSummary,
  assertFieldTypeahead,
  assertFieldCheckboxes,
} from '../../support/assertions'

describe('Support provided', () => {
  const { supportProvided } = formFields

  beforeEach(() => {
    cy.intercept('GET', '/api-proxy/v4/metadata/associated-programme', [
      { name: 'Afterburner' },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/hvc', [
      { name: 'Australia Consumer Goods & Retail: E004' },
    ])
    cy.visit(supportProvidedStep)
  })

  it('should render a step heading', () => {
    cy.get(supportProvided.heading).should('have.text', 'Support given')
  })

  it('should render a hint', () => {
    cy.get(supportProvided.hint).should(
      'have.text',
      'Did any of these help the customer achieve this win?'
    )
  })

  it('should render a typeahead for high value campaign', () => {
    cy.get(supportProvided.hvc).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'High Value Campaign (HVC) code (optional)',
        hint: 'If the win was linked to a HVC, select the appropriate campaign.',
      })
    })
  })

  it('should render a support given typeahead', () => {
    cy.get(supportProvided.typeOfSupport).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'What type of support was given?',
        hint: 'You can add up to 5 types of support.',
      })
    })
  })

  it('should render an associated programme typeahead', () => {
    cy.get(supportProvided.associatedProgramme).then((element) => {
      assertFieldTypeahead({
        element,
        label:
          'Was there a DBT campaign or event that contributed to this win?',
        hint: 'You can add up to 5 campaigns or events.',
      })
    })
  })

  it('should render personally confirmed checkbox', () => {
    assertFieldCheckboxes({
      element: supportProvided.personallyConfirmed,
      options: [
        {
          label: 'I confirm that this information is complete and accurate.',
          checked: false,
        },
      ],
    })
  })

  it('should render a manager confirmed checkbox', () => {
    assertFieldCheckboxes({
      element: supportProvided.lineManagerConfirmed,
      options: [
        {
          label: 'My line manager has agreed that this win should be recorded.',
          checked: false,
        },
      ],
    })
  })

  it('should display validation error messages on mandatory fields', () => {
    clickContinueButton()
    assertErrorSummary([
      'Select at least one type of support',
      'Select at least one type of DBT campaign or event',
      'Confirm that this information is complete and accurate',
      'Confirm your line manager has agreed that this win should be recorded',
    ])
    assertFieldError(
      cy.get(supportProvided.typeOfSupport),
      'Select at least one type of support',
      true
    )
    assertFieldError(
      cy.get(supportProvided.associatedProgramme),
      'Select at least one type of DBT campaign or event',
      true
    )
    cy.get(supportProvided.personallyConfirmed).should(
      'contain',
      'Confirm that this information is complete and accurate'
    )
    cy.get(supportProvided.lineManagerConfirmed).should(
      'contain',
      'Confirm your line manager has agreed that this win should be recorded'
    )
  })
})
