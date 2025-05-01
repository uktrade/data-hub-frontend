import 'cypress-axe'
import React from 'react'
import { mount } from 'cypress/react'

import SelectedChips from '../../../../../../src/client/components/Typeahead/SelectedChips'

describe('SelectedChips – Accessibility', () => {
  const testCases = [
    { name: 'contacts', label: 'Export Contact', displayLabel: 'Jake Roberts' },
    {
      name: 'advisers',
      label: 'Primary Adviser',
      displayLabel: 'Sarah Connor',
    },
    {
      name: 'participants',
      label: 'Internal Participant',
      displayLabel: 'John Doe',
    },
  ]

  testCases.forEach(({ name, label, displayLabel }) => {
    it(`adds accessible aria-labels to remove buttons for field labeled "${label}"`, () => {
      const selectedOptions = [{ value: '1', label: displayLabel }]
      const expectedLabel = `Remove ${displayLabel} from ${label}`

      mount(
        <SelectedChips
          name={name}
          label={label}
          selectedOptions={selectedOptions}
          onOptionRemove={() => {}}
        />
      )

      cy.contains('button', displayLabel)
        .should('exist')
        .invoke('attr', 'aria-label')
        .should('eq', expectedLabel)
    })
  })

  // scenario where chipLabel is populated for multiple fields
  ;[
    { name: 'contacts', label: 'Export Contact', chipDisplayLabel: 'Johnny S' },
    { name: 'advisers', label: 'Primary Adviser', chipDisplayLabel: 'SC' },
  ].forEach(({ name, label, chipDisplayLabel }) => {
    it(`uses chipLabel when present and applies correct aria-label for field labeled "${label}"`, () => {
      const chipLabelOptions = [
        { value: '2', label: 'John Smith', chipLabel: chipDisplayLabel },
      ]
      const expectedLabel = `Remove ${chipDisplayLabel} from ${label}`

      mount(
        <SelectedChips
          name={name}
          label={label}
          selectedOptions={chipLabelOptions}
          onOptionRemove={() => {}}
        />
      )

      cy.contains('button', chipDisplayLabel)
        .should('exist')
        .invoke('attr', 'aria-label')
        .should('eq', expectedLabel)
    })
  })

  it('has no critical accessibility violations (axe)', () => {
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical'],
    })
  })
})
