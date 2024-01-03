import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldTypeahead from '../../../../../../src/client/components/Form/elements/FieldTypeahead'
import DataHubProvider from '../../provider'

describe('FieldTypeahead - autoScroll', () => {
  const Component = (props) => (
    <DataHubProvider>
      <Form id="export-form">
        {[...Array(10)].map((_, i) => (
          <FieldTypeahead name={`typeahead-test-${i}`} />
        ))}
        <FieldTypeahead name="typeahead-autoscroll-test" {...props} />
      </Form>
    </DataHubProvider>
  )

  context('When autoScroll is set to false', () => {
    it('the form should stay in the default view', () => {
      cy.mount(<Component autoScroll={false} />)
      cy.isNotInViewport('#typeahead-autoscroll-test')
    })
  })

  context('When autoScroll is set to true', () => {
    it('the form should scroll to the component', () => {
      cy.mount(<Component autoScroll={true} />)
      cy.isInViewport('#typeahead-autoscroll-test')
    })
  })
})
