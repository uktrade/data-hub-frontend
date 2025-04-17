import 'cypress-axe'
import React from 'react'
import { mount } from 'cypress/react'

import SelectedChips from '../../../../../../src/client/components/Typeahead/SelectedChips'

describe('SelectedChips – Accessibility', () => {
  const selectedOptions = [
    { value: '1', label: 'Jake Roberts' },
    { value: '2', label: 'Sarah Connor' },
  ]

  it('adds accessible aria-labels to remove buttons', () => {
    mount(
      <SelectedChips
        name="contacts"
        selectedOptions={selectedOptions}
        onOptionRemove={() => {}}
      />
    )

    selectedOptions.forEach((option) => {
      const expectedLabel = `Remove ${option.label} as a contact`
      cy.contains('button', option.label).should(
        'have.attr',
        'aria-label',
        expectedLabel
      )
    })
  })

  it('has no critical accessibility violations (axe)', () => {
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical'],
    })
  })
})
