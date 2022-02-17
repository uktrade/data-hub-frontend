import React from 'react'
import { mount } from '@cypress/react'

import FieldAddAnother from '../../../../src/client/components/Form/elements/FieldAddAnother'
import DataHubProvider, { store } from './provider'

const RESET_ACTION = {
  type: 'RESET',
}

describe('FieldAddAnother', () => {
  beforeEach(() => {
    store.dispatch(RESET_ACTION)
    mount(
      <DataHubProvider>
        <FieldAddAnother
          id="div-items"
          name="div-items"
          label="Label"
          data-test-prefix="test-field-"
          item-name="item"
          initialChildGroupCount={2}
        >
          {({ groupIndex }) => (
            <div id={`test_${groupIndex}`}>Item {groupIndex} rendered</div>
          )}
        </FieldAddAnother>
      </DataHubProvider>
    )
  })

  context('When rendered', () => {
    it('should render two child components', () => {
      getComponentItems().should('have.length', 2)
    })

    it('should render accessibility items in the correct order', () => {
      cy.get('[aria-label="1st item"]')
      cy.get('[aria-label="2nd item"]')
    })

    it('should render two removes with accessibility', () => {
      getDivByRegionRole().should('have.length', 2).contains('a', 'Remove')
      getDivByRegionRole().find('[aria-label="Remove 1st item"]')
      getDivByRegionRole().find('[aria-label="Remove 2nd item"]')
    })

    it('should add button with "Add another item" display', () => {
      getAddAnotherButton()
    })

    it('should render accessibility on Add another button', () => {
      cy.get('[aria-label="Add a 3rd item"]')
    })
  })

  context('When adding items', () => {
    it('should create a new item and update the button accessibility information', () => {
      getComponentItems().should('have.length', 2)

      clickAddAnotherButton()

      cy.get('[aria-label="Add a 4th item"]')
      getComponentItems().should('have.length', 3)
      cy.get('[aria-label="3rd item"]')
    })

    it('should add 22 controls with the 22nd item displaying the [22](nd) accessibility information', () => {
      getComponentItems().should('have.length', 2)

      for (let index = 0; index < 20; index++) {
        clickAddAnotherButton()
      }

      getComponentItems().should('have.length', 22)
      cy.get('[aria-label="22nd item"]')
    })
  })

  context('When removing items', () => {
    it('should remove the second item and verify the first item still exists', () => {
      getComponentItems().should('have.length', 2)

      removeSecondItem()

      cy.get('[data-test="test-field-0"]').contains('Item 0 rendered')
    })

    it('should remove the the first item and verify the second item still exists', () => {
      getComponentItems().should('have.length', 2)

      removeFirstItem()

      cy.get('[data-test="test-field-0"]').contains('Item 1 rendered')
    })

    it('should add a new item and remove the first item and verify the other two still exists', () => {
      getComponentItems().should('have.length', 2)
      clickAddAnotherButton()
      getComponentItems().should('have.length', 3)

      removeFirstItem()

      getComponentItems().should('have.length', 2)
      cy.get('[data-test="test-field-0"]').contains('Item 1 rendered')
      cy.get('[data-test="test-field-1"]').contains('Item 2 rendered')
    })
  })
})

function getDivByRegionRole() {
  return cy.get('div[role="region"]')
}

function getAddAnotherButton() {
  return cy.contains('button', 'Add another item')
}

function getComponentItems() {
  return cy.get('[data-test^="test-field-"]')
}

function removeSecondItem() {
  getDivByRegionRole().find('[aria-label="Remove 2nd item"]').click()
}

function removeFirstItem() {
  cy.get('div[role="region"]').find('[aria-label="Remove 1st item"]').click()
}

function clickAddAnotherButton() {
  getAddAnotherButton().click()
}
