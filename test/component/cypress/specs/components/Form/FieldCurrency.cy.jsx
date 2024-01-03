import React from 'react'

import { Form } from '../../../../../../src/client/components'
import FieldCurrency from '../../../../../../src/client/components/Form/elements/FieldCurrency'
import DataHubProvider from '../../provider'
import { decimal } from '../../../../../../src/client/utils/number-utils'

describe('FieldCurrency', () => {
  const Component = (props) => (
    <DataHubProvider>
      <Form id="export-form">
        <FieldCurrency name="currency-test" {...props} />
      </Form>
    </DataHubProvider>
  )

  beforeEach(() => {
    cy.mount(<Component />)
    cy.get('#currency-test').as('currencyInput')
  })

  context('when a default value is provided', () => {
    it('should set the value raw values to correct values', () => {
      cy.mount(<Component initialValue={123456} />)
      cy.get('@currencyInput')
        .should('have.attr', 'value', decimal('123456'))
        .should('have.attr', 'data-raw-value', '123456')
    })
  })

  context('when a non-numerical value is entered', () => {
    it('should not have any formatting applied', () => {
      cy.get('@currencyInput').type('abc').blur()
      cy.get('@currencyInput')
        .should('have.attr', 'value', 'abc')
        .should('have.attr', 'data-raw-value', 'abc')
    })
  })

  context('when a numerical value is entered', () => {
    it('it should have currency formatting removed when editing the input', () => {
      cy.get('@currencyInput').type('1000000000')
      cy.get('@currencyInput')
        .should('have.attr', 'value', '1000000000')
        .should('have.attr', 'data-raw-value', '1000000000')
    })

    it('it should have currency formatting applied when leaving focus', () => {
      cy.get('@currencyInput').type('1000000000').blur()
      cy.get('@currencyInput')
        .should('have.attr', 'value', decimal('1000000000'))
        .should('have.attr', 'data-raw-value', '1000000000')
    })

    it('it should accept a user entering their own formatting', () => {
      cy.get('@currencyInput').type('10,000').blur()
      cy.get('@currencyInput')
        .should('have.attr', 'value', decimal('10000'))
        .should('have.attr', 'data-raw-value', '10000')
    })

    context(
      'when a non numberical value is appended to a numerical value',
      () => {
        it('it should have currency formatting removed when leaving focus', () => {
          cy.get('@currencyInput').type('10000').blur()
          cy.get('@currencyInput')
            .should('have.attr', 'value', decimal('10000'))
            .should('have.attr', 'data-raw-value', '10000')

          cy.get('@currencyInput').type('abc')
          cy.get('@currencyInput').should(
            'have.attr',
            'data-raw-value',
            '10000abc'
          )
          cy.get('@currencyInput').blur()
          cy.get('@currencyInput').should('have.attr', 'value', '10000abc')
        })
      }
    )
  })
})
