import React from 'react'
import { mount } from '@cypress/react'
import Typeahead from '../../../../src/client/components/Typeahead2/Typeahead'
import typeaheadTasks from '../../../../src/client/components/Typeahead2/tasks'

import DataHubProvider, { store } from './provider'

const RESET_ACTION = {
  type: 'RESET',
}

const options = [
  { value: '0001', label: 'Apple' },
  { value: '0002', label: 'Banana' },
  { value: '0003', label: 'Blackberry' },
  { value: '0004', label: 'Blueberry' },
  { value: '0005', label: 'Orange' },
  { value: '0006', label: 'Papaya' },
  { value: '0007', label: 'Passion Fruit' },
  { value: '0008', label: 'Pear' },
  { value: '0009', label: 'Pineapple' },
  { value: '0010', label: 'Prickly Pear That Has a Very Very Long Name' },
]

describe('Typeahead2', () => {
  context('single-select with standard options', () => {
    beforeEach(() => {
      store.dispatch(RESET_ACTION)
      mount(
        <DataHubProvider tasks={typeaheadTasks}>
          <Typeahead
            id="typeahead-single-1"
            isMulti={false}
            closeMenuOnSelect={true}
            name="typeahead"
            options={options}
            placeholder="Search..."
            label="Pick a fruit"
            data-test="test-component"
          />
        </DataHubProvider>
      )
      cy.get('[data-test="test-component"]').as('component')
    })

    it('should list all the options when opened', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', options.length)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.text', options[index].label)
            .should('have.attr', 'aria-selected', 'false')
        })
    })

    it('should select an option when it is clicked', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(2)
        .should('have.attr', 'aria-selected', 'false')
        .click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('not.be.visible')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.attr', 'value', options[2].label)
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(2)
        .should('have.attr', 'aria-selected', 'true')
    })

    it('should filter options when input is typed', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('Bl')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Blackberry')
        .next()
        .should('have.text', 'Blueberry')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .blur()
        .click()
        .should('have.attr', 'value', '')
    })
  })

  context('multi-select with standard options', () => {
    beforeEach(() => {
      store.dispatch(RESET_ACTION)
      mount(
        <DataHubProvider tasks={typeaheadTasks}>
          <Typeahead
            id="typeahead-multi-1"
            isMulti={true}
            closeMenuOnSelect={false}
            name="typeahead-ms"
            options={options}
            placeholder="Search..."
            label="Pick a fruit"
            data-test="test-component-ms"
          />
        </DataHubProvider>
      )
      cy.get('[data-test="test-component-ms"]').as('component')
    })

    it('should list all the options when opened', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', options.length)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.text', options[index].label)
            .should('have.attr', 'aria-selected', 'false')
        })
    })

    it('should select options when clicked', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(3)
        .should('have.attr', 'aria-selected', 'false')
        .click()
        .should('have.attr', 'aria-selected', 'true')
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'false')
        .click()
        .should('have.attr', 'aria-selected', 'true')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.attr', 'value', '')
      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 2)
        .first()
        .should('have.text', options[3].label)
        .next()
        .should('have.text', options[1].label)

      // Click remove chip
      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .first()
        .find('button')
        .click()

      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 1)

      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(3)
        .should('have.attr', 'aria-selected', 'false')

      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'true')
    })

    it('should filter options when input is typed', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('Bl')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Blackberry')
        .next()
        .should('have.text', 'Blueberry')
        .click()
        .should('have.attr', 'aria-selected', 'true')

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .blur()
        .click()
        .should('have.attr', 'value', '')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', options.length)
        .eq(3)
        .should('have.text', options[3].label)
        .should('have.attr', 'aria-selected', 'true')
    })
  })
})
