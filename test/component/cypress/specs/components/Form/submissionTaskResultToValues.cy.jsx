import React from 'react'

import {
  Form,
  FieldInput,
  FieldSelect,
  FieldCheckboxes,
  FieldRadios,
} from '../../../../../../src/client/components'

describe('submissionTaskResultToValues', () => {
  context('When there are no steps', () => {
    it('should render a save button', () => {
      cy.mountWithProvider(
        <Form
          id="my-form"
          submissionTaskName="myTask"
          submissionTaskResultToValues={(result) => result}
        >
          <FieldInput name="input" />
          <FieldSelect
            name="select"
            options={[
              { label: 'Foo', value: 'foo' },
              { label: 'Bar', value: 'bar' },
              { label: 'Baz', value: 'baz' },
            ]}
          />
          <FieldCheckboxes
            name="checkboxes"
            options={[
              { label: 'Foo', value: 'foo' },
              { label: 'Bar', value: 'bar' },
              { label: 'Baz', value: 'baz' },
            ]}
          />
          <FieldRadios
            name="radios"
            options={[
              { label: 'Foo', value: 'foo' },
              { label: 'Bar', value: 'bar' },
              { label: 'Baz', value: 'baz' },
            ]}
          />
        </Form>,
        {
          tasks: {
            myTask: (payload) => ({
              input: payload.input.toUpperCase(),
              select: 'bar',
              checkboxes: ['foo', 'baz'],
              radios: 'bar',
            }),
          },
        }
      )

      // FieldInput
      const INPUT_TEXT = 'abcdefg'
      cy.get('[name=input]').type(INPUT_TEXT).should('have.value', INPUT_TEXT)

      // FieldSelect
      cy.get('#select').select('baz')

      // FieldCheckboxes
      cy.get('[type=checkbox][name=bar]').check()
      cy.get('[type=checkbox][name=foo]').should('not.be.checked')
      cy.get('[type=checkbox][name=bar]').should('be.checked')
      cy.get('[type=checkbox][name=baz]').should('not.be.checked')

      // FieldRadios
      cy.get('[type=radio][value=foo]').check()
      cy.get('[type=radio][value=foo]').should('be.checked')
      cy.get('[type=radio][value=bar]').should('not.be.checked')
      cy.get('[type=radio][value=baz]').should('not.be.checked')

      cy.get('button').contains('Save').click()

      // After submission, fields should have values returned from submissionTaskResultToValues
      cy.get('[name=input]').should('have.value', INPUT_TEXT.toUpperCase())

      cy.get('#select').should('have.value', 'bar')

      cy.get('[type=checkbox][name=foo]').should('be.checked')
      cy.get('[type=checkbox][name=bar]').should('not.be.checked')
      cy.get('[type=checkbox][name=baz]').should('be.checked')

      cy.get('[type=radio][value=foo]').should('not.be.checked')
      cy.get('[type=radio][value=bar]').should('be.checked')
      cy.get('[type=radio][value=baz]').should('not.be.checked')
    })
  })
})
