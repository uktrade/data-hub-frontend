import React from 'react'

import { Form } from '../../../../../src/client/components'
import FieldWrapper from '../../../../../src/client/components/Form/elements/FieldWrapper'
import DataHubProvider from '../provider'

describe('FieldSelect', () => {
  const Component = (props) => (
    <DataHubProvider>
      <Form id="export-form">
        <FieldWrapper
          name="wrapper-test"
          legend="legend"
          label="label"
          {...props}
        />
      </Form>
    </DataHubProvider>
  )

  context('When boldLabel is set to false', () => {
    it('the fieldset label should not have any font weight applied', () => {
      cy.mount(<Component boldLabel={false} />)
      cy.get('label').should('have.css', 'font-weight', '400')
    })
  })

  context('When boldLabel is set to true', () => {
    it('the fieldset label should have font weight applied', () => {
      cy.mount(<Component />)
      cy.get('label').should('have.css', 'font-weight', '700')
    })
  })
})
