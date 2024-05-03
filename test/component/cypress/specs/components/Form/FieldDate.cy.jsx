import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldDate from '../../../../../../src/client/components/Form/elements/FieldDate'
import {
  assertFieldError,
  assertNotExists,
} from '../../../../../functional/cypress/support/assertions'

describe('FieldDate', () => {
  beforeEach(() => {
    cy.mountWithProvider(
      <Form
        id="export-form"
        analyticsFormName="export-form"
        cancelRedirectTo={() => '/'}
        submissionTaskName="EMPTY"
      >
        <FieldDate name="test-date" />
      </Form>
    )
  })

  context('when entering a 2 digit value for year', () => {
    it('should display a validation message', () => {
      cy.get('[data-test=test_date-day]').type('01').blur()
      cy.get('[data-test=test_date-month]').type('01').blur()
      cy.get('[data-test=test_date-year]').type('25').blur()

      cy.get('[data-test=submit-button]').click()

      assertFieldError(
        cy.get('[data-test=field-test-date]'),
        'Enter a year as 4 digits',
        false
      )
    })
  })

  context('when entering a 4 digit value for year', () => {
    it('should not display a validation message', () => {
      cy.get('[data-test=test_date-day]').type('04').blur()
      cy.get('[data-test=test_date-month]').type('09').blur()
      cy.get('[data-test=test_date-year]').type('2028').blur()

      cy.get('[data-test=submit-button]').click()

      assertNotExists('[data-test=field-test-date-error]')
    })
  })
})
