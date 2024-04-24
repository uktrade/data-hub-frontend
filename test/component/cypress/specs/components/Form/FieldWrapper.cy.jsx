import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldWrapper from '../../../../../../src/client/components/Form/elements/FieldWrapper'

describe('FieldSelect', () => {
  context('When boldLabel is set to false', () => {
    it('the fieldset label should not have any font weight applied', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          <FieldWrapper
            name="wrapper-test"
            legend="legend"
            label="label"
            boldLabel={false}
          />
        </Form>
      )
      cy.get('label').should('have.css', 'font-weight', '400')
    })
  })

  context('When boldLabel is set to true', () => {
    it('the fieldset label should have font weight applied', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          <FieldWrapper name="wrapper-test" legend="legend" label="label" />
        </Form>
      )
      cy.get('label').should('have.css', 'font-weight', '700')
    })
  })
})
