import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldSelect from '../../../../../../src/client/components/Form/elements/FieldSelect'

describe('FieldSelect', () => {
  context('When initialValue is not provided', () => {
    it('the selected option should not be set', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          <FieldSelect
            name="select-test"
            options={[
              { value: 'a', label: 'label 1' },
              { value: 'b', label: 'label 2' },
            ]}
          />
        </Form>
      )
      cy.get('select option:selected').should('have.text', 'Please select')
    })
  })

  context('When initialValue is provided', () => {
    it('the selected option should be set to the initialValue', () => {
      cy.mountWithProvider(
        <Form id="export-form">
          <FieldSelect
            name="select-test"
            options={[
              { value: 'a', label: 'label 1' },
              { value: 'b', label: 'label 2' },
            ]}
            initialValue="b"
          />
        </Form>
      )
      cy.get('select option:selected').should('have.text', 'label 2')
    })
  })

  context('When checking fullWidth', () => {
    beforeEach(() => {
      //The govuk react has a media query that makes the select component 100% width below tablet,
      //so make sure the viewport is above that breakpoint
      cy.viewport(1280, 720)
    })

    context('and fullWidth is true', () => {
      it('the select component should render with 100% width', () => {
        cy.mountWithProvider(
          <Form id="export-form">
            <FieldSelect
              name="select-test"
              options={[
                { value: 'a', label: 'label 1' },
                { value: 'b', label: 'label 2' },
              ]}
              fullWidth={true}
            />
          </Form>
        )
        cy.getViewport().then((viewportRect) => {
          cy.get('select')
            .invoke('outerWidth')
            .should('be.gt', viewportRect.width / 2)
        })
      })
    })

    context('and fullWidth is false', () => {
      it('the select component should render with 50% width', () => {
        cy.mountWithProvider(
          <Form id="export-form">
            <FieldSelect
              name="select-test"
              options={[
                { value: 'a', label: 'label 1' },
                { value: 'b', label: 'label 2' },
              ]}
              fullWidth={false}
            />
          </Form>
        )
        cy.getViewport().then((viewportRect) => {
          cy.get('select')
            .invoke('outerWidth')
            .should('be.lt', viewportRect.width / 2)
        })
      })
    })
  })
})
