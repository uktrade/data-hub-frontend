import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldTypeahead from '../../../../../../src/client/components/Form/elements/FieldTypeahead'

describe.skip('FieldTypeahead - autoScroll', () => {
  context('When autoScroll is set to false', () => {
    it('the form should stay in the default view', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          {[...Array(10)].map((_, i) => (
            <FieldTypeahead name={`typeahead-test-${i}`} />
          ))}
          <FieldTypeahead name="typeahead-autoscroll-test" autoScroll={false} />
        </Form>
      )
      cy.isNotInViewport('#typeahead-autoscroll-test')
    })
  })

  context('When autoScroll is set to true', () => {
    it('the form should scroll to the component', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          {[...Array(10)].map((_, i) => (
            <FieldTypeahead name={`typeahead-test-${i}`} />
          ))}
          <FieldTypeahead name="typeahead-autoscroll-test" autoScroll={true} />
        </Form>
      )
      cy.isInViewport('#typeahead-autoscroll-test')
    })
  })
})
