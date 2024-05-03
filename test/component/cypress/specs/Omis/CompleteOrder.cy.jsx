import React from 'react'

import { CompleteAssigneesTable } from '../../../../../src/client/modules/Omis/CompleteOrder'
import {
  assertDetails,
  assertErrorSummary,
  assertFieldInputNoLabel,
  assertGovReactTable,
} from '../../../../functional/cypress/support/assertions'

const order = {
  id: '12345',
}

const assignees = [
  { adviser: { id: '123', name: 'Iakovos Test' }, estimatedTime: 60 },
  { adviser: { id: '456', name: 'Ian Test' }, estimatedTime: 120 },
  { adviser: { id: '789', name: 'Iancu Test' }, estimatedTime: 180 },
  { adviser: { id: '101', name: 'Ibai Test' }, estimatedTime: 240 },
  { adviser: { id: '112', name: 'Ibrahim Test' }, estimatedTime: 300 },
]

describe('CompleteOrder', () => {
  beforeEach(() => {
    cy.viewport(1024, 768)
    cy.mountWithProvider(
      <CompleteAssigneesTable order={order} assignees={assignees} />
    )
  })

  it('should render the message', () => {
    cy.get('[data-test="completion-message"]')
      .should('exist')
      .should(
        'have.text',
        'Complete the order after all work has been sent to the contact.'
      )
  })

  it('should render the table and the assignee data', () => {
    assertGovReactTable({
      element: '[data-test="actual-hours-table"]',
      rows: [
        ['', 'Original estimate', 'Actual hours worked'],
        [assignees[0].adviser.name, '1 hour', ''],
        [assignees[1].adviser.name, '2 hours', ''],
        [assignees[2].adviser.name, '3 hours', ''],
        [assignees[3].adviser.name, '4 hours', ''],
        [assignees[4].adviser.name, '5 hours', ''],
      ],
    })
  })

  it('should render the input fields with initial values', () => {
    cy.get('[data-test="field-123"]').then((element) => {
      assertFieldInputNoLabel({
        element,
        value: '',
      })
    })
    cy.get('[data-test="field-456"]').then((element) => {
      assertFieldInputNoLabel({
        element,
        value: '',
      })
    })
    cy.get('[data-test="field-789"]').then((element) => {
      assertFieldInputNoLabel({
        element,
        value: '',
      })
    })
    cy.get('[data-test="field-101"]').then((element) => {
      assertFieldInputNoLabel({
        element,
        value: '',
      })
    })
    cy.get('[data-test="field-112"]').then((element) => {
      assertFieldInputNoLabel({
        element,
        value: '',
      })
    })
  })

  it('should render the details component', () => {
    cy.get('[data-test="why-provide-details"]').then((element) => {
      assertDetails({
        element,
        summary: 'Why do I need to provide hours worked?',
        content:
          "This information will not be used to analyse individual performance.The actual hours worked can be different to those in the original estimate.This information won't be shared with the client, and won't change how much the client has to pay for the work.",
      })
    })
  })

  it('should not submit the form with no values entered', () => {
    cy.get('[data-test="submit-button"]').click()
    assertErrorSummary([
      'Enter the number of actual hours worked',
      'Enter the number of actual hours worked',
      'Enter the number of actual hours worked',
      'Enter the number of actual hours worked',
      'Enter the number of actual hours worked',
      'This order cannot be completed until the work has been sent to the contact',
    ])
  })

  it('should not allow invalid values to be entered', () => {
    cy.get('[data-test="checkbox-Yes"]').click()
    cy.get('[data-test="adviser-0-input"]').type('not a number')
    cy.get('[data-test="adviser-1-input"]').type('0.5')
    cy.get('[data-test="adviser-2-input"]').type('@£$%^')
    cy.get('[data-test="adviser-3-input"]').type('@£$%^')
    cy.get('[data-test="adviser-4-input"]').type('@£$%^')
    cy.get('[data-test="submit-button"]').click()
    assertErrorSummary([
      'Enter a whole number',
      'Enter a whole number',
      'Enter a whole number',
      'Enter a whole number',
      'Enter a whole number',
    ])
  })
})
