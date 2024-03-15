import { formFields, customerDetailsStep } from './constants'
import { clickContinueButton } from '../../support/actions'
import {
  assertFieldError,
  assertErrorSummary,
  assertFieldTypeahead,
} from '../../support/assertions'

describe('Customer details', () => {
  const { customerDetails } = formFields

  beforeEach(() => cy.visit(customerDetailsStep))

  it('should render a step heading', () => {
    cy.get(customerDetails.heading).should('have.text', 'Customer details')
  })

  it('should render a contact hint', () => {
    cy.get(customerDetails.contactHint).should(
      'have.text',
      'To select a customer contact name, it must have already been added to Data Hub. If not listed, go to the company page to add them.'
    )
  })

  it('should render Company contacts label and a Typeahead', () => {
    cy.get(customerDetails.contacts).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Company contacts',
        hint: 'This contact will be emailed to approve the win.',
      })
    })
  })

  it('should render HQ location label and a Typeahead', () => {
    cy.get(customerDetails.location).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'HQ location',
      })
    })
  })

  it('should render Export potential label and a Typeahead', () => {
    cy.get(customerDetails.potential).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Export potential',
      })
    })
  })

  it('should render Export potential label and a Typeahead', () => {
    cy.get(customerDetails.experience).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Export experience',
        hint: 'Your customer will be asked to confirm this information.',
      })
    })
  })

  it('should display validation error messages on mandatory fields', () => {
    clickContinueButton()
    assertErrorSummary([
      'Select a company contact',
      'Select HQ location',
      'Select export potential',
      'Select export experience',
    ])
    assertFieldError(
      cy.get(customerDetails.contacts),
      'Select a company contact',
      true
    )
    assertFieldError(
      cy.get(customerDetails.location),
      'Select HQ location',
      false
    )
    assertFieldError(
      cy.get(customerDetails.potential),
      'Select export potential',
      false
    )
    assertFieldError(
      cy.get(customerDetails.experience),
      'Select export experience',
      true
    )
  })
})
