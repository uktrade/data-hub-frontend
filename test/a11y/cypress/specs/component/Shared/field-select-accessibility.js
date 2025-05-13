import 'cypress-axe'
import React from 'react'
import { mount } from 'cypress/react'

import { FieldSelect } from '../../../../../../src/client/components'
import Form from '../../../../../../src/client/components/Form'
import { createTestProvider } from '../../../../../component/cypress/specs/provider'

describe('FieldSelect – Accessibility', () => {
  it('Check select stays focused after selecting an option', () => {
    const Provider = createTestProvider({})

    mount(
      <Provider>
        <Form id="test-form" store="test">
          <FieldSelect
            name="select-test"
            options={[
              { value: 'a', label: 'label 1' },
              { value: 'b', label: 'label 2' },
            ]}
          />
        </Form>
      </Provider>
    )

    cy.get('#select-test').focus().should('have.focus')
    cy.get('#select-test').select('label 2')
    cy.get('#select-test').should('have.focus')
  })
})
