import 'cypress-axe'
import React from 'react'
import { mount } from 'cypress/react'

import { FieldInput } from '../../../../../../src/client/components'
import Form from '../../../../../../src/client/components/Form'
import { createTestProvider } from '../../../../../component/cypress/specs/provider'

describe('ErrorSummary – Accessibility', () => {
  it('Check input is focused when clicking on error message', () => {
    const Provider = createTestProvider({})

    mount(
      <Provider>
        <Form id="test-form" store="test">
          <FieldInput
            label="Text"
            hint="Some hint"
            required="Enter text"
            type="text"
            name="test"
            data-test="test-field"
          />
        </Form>
      </Provider>
    )

    cy.get('[data-test="submit-button"]').click()

    const input = cy.get('[data-test="test-field"]')

    input.should('have.attr', 'aria-invalid', 'true')

    input.invoke('attr', 'aria-describedBy').then((describedById) => {
      expect(describedById).to.exist
      cy.get(`#${describedById}`).should('have.text', 'Enter text')
    })

    cy.get('[data-test="summary-form-errors"]').within(() => {
      cy.get('ul > li').should('have.length', 1)
      cy.get('li a').click()
      cy.focused().should('have.attr', 'data-test', 'test-field')
    })
  })
})
