import React from 'react'

import FieldAddAnother from '../../../../../../src/client/components/Form/elements/FieldAddAnother'
import { Form, Step, FieldInput } from '../../../../../../src/client/components'

const testInMultiStepForm = ({ initial, toAdd, toRemove }) => {
  const remainingEntries = [...initial, ...toAdd]
    .map((x, i) => [x, i])
    .filter(([, i]) => !toRemove.includes(i))
    .map(([x, i]) => `${x}#${i}`)

  const assertItems = (entries) =>
    cy.get('div[data-test^="group-"]').each((el, i) => {
      const [value, groupId] = entries[i]
      cy.wrap(el).within(() => {
        cy.contains(`Thing ${groupId}`)
        cy.get('input').should('have.value', value)
      })
    })

  context(
    `with initial=${initial}, toAdd=${toAdd} and toRemove=${toRemove}`,
    () =>
      it(`Preserves entries ${remainingEntries} when moving between form steps`, () => {
        cy.mountWithProvider(
          <Form id="test-form">
            <Step name="step-1">
              Step 1
              <FieldInput type="text" name="foo" label="Foo" />
            </Step>
            <Step name="step-2">
              Step 2
              <FieldInput type="text" name="bar" label="Bar" />
              <FieldAddAnother
                itemName="thing"
                dataTestPrefix="group-"
                initialChildGroupCount={initial.length}
              >
                {({ groupIndex }) => (
                  <FieldInput
                    type="text"
                    name={`thing-${groupIndex}`}
                    label={`Thing ${groupIndex}`}
                  />
                )}
              </FieldAddAnother>
            </Step>
            <Step name="step-3">
              Step 3
              <FieldInput type="text" name="baz" label="Baz" />
            </Step>
          </Form>
        )

        cy.contains('Step 1')

        cy.contains('Continue').click()

        cy.contains('Step 2')

        initial.forEach((thing, i) => {
          cy.get(`[name="thing-${i}"]`).type(thing)
        })

        toAdd.forEach((thing, i) => {
          cy.contains('button', 'Add another thing').click()
          cy.get(`[name="thing-${i + initial.length}"]`).type(thing)
        })

        assertItems([...initial, ...toAdd].map((x, groupId) => [x, groupId]))

        toRemove.forEach((index) =>
          cy
            .get(`#field-thing-${index}`)
            .closest('[role="region"]')
            .within(() => cy.contains('Remove').click())
        )

        const leftoverThings = [...initial, ...toAdd]
          .map((x, groupId) => [x, groupId])
          .filter(([, groupId]) => !toRemove.includes(groupId))

        assertItems(leftoverThings)

        // Go to step 1
        cy.contains('button', 'Back').click()
        cy.contains('Step 1')

        // Go back to step 2
        cy.contains('button', 'Continue').click()
        cy.contains('Step 2')

        assertItems(leftoverThings)

        // Go to step 3
        cy.contains('button', 'Continue').click()
        cy.contains('Step 3')

        // Go back to step 2
        cy.contains('button', 'Back').click()
        cy.contains('Step 2')

        assertItems(leftoverThings)
      })
  )
}

describe('FieldAddAnother', () => {
  context('standalone', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <FieldAddAnother
          id="div-items"
          name="div-items"
          legend="Legend"
          dataTestPrefix="test-field-"
          itemName="item"
          initialChildGroupCount={2}
          limitChildGroupCount={4}
        >
          {({ groupIndex }) => (
            <div id={`test_${groupIndex}`}>Item {groupIndex} rendered</div>
          )}
        </FieldAddAnother>
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

      it('should render a legend', () => {
        cy.get('legend').should('have.text', 'Legend')
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

      it('should add 2 controls with the 2nd item displaying the [2](nd) accessibility information', () => {
        getComponentItems().should('have.length', 2)

        cy.get('[aria-label="2nd item"]')
      })

      it('should not render the "Add another" button when the limit has been breached', () => {
        clickAddAnotherButton()
        clickAddAnotherButton()
        cy.get('[data-test="add-another"]').should('not.exist')
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

      it('should render the "Add another" button when the limit has not been breached', () => {
        clickAddAnotherButton()
        clickAddAnotherButton()
        cy.get('[data-test="add-another"]').should('not.exist')
        removeFirstItem()
        cy.get('[data-test="add-another"]').should('exist')
      })
    })
  })

  context('in form', () => {
    testInMultiStepForm({
      initial: [],
      toAdd: ['foo', 'bar', 'baz'],
      toRemove: [1],
    })

    testInMultiStepForm({
      initial: ['X', 'Y'],
      toAdd: ['A', 'B', 'C', 'D'],
      toRemove: [2, 4],
    })

    testInMultiStepForm({
      initial: ['X', 'Y', 'Z'],
      toAdd: ['A', 'B'],
      toRemove: [1, 3],
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
