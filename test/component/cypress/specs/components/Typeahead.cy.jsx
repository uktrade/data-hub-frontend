import React from 'react'

import Typeahead from '../../../../../src/client/components/Typeahead/Typeahead'
import typeaheadTasks from '../../../../../src/client/components/Typeahead/tasks'

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

const asyncOptions = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Holly Clins - Heart of the South West LEP',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Bernard Harris-Patelc - Welsh Government (Investment)',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Dennis Kennedy',
  },
  {
    value: 'eecd2bb8-dc73-4a42-8655-4ae42d4d3cff',
    label: 'Denzil Lincoln',
  },
  {
    value: '126b5bf8-4849-4c15-acbf-5d0b2e78d87c',
    label: 'Disabled option',
    isDisabled: true,
  },
  {
    value: 'c223db47-cde2-42a3-8e0e-3bf3373e989f',
    label: 'This has metadata',
    meta: [
      { label: 'Trading name', value: 'This is an example' },
      { label: 'Address', value: 'An address' },
    ],
  },
  {
    value: 'd4108ff1-328d-4b7c-afeb-6e0fe8d1a0a4',
    label: 'This has metadata and inset text',
    meta: [
      { label: 'Trading name', value: 'This is an example' },
      { label: 'Address', value: 'An address' },
    ],
    insetText: 'This is some additional inset text',
  },
]

export const mockLoadOptions = (query = '') =>
  new Promise((resolve) =>
    resolve(
      query
        ? asyncOptions.filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          )
        : []
    )
  )

describe('Typeahead', () => {
  context('static single-select', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Typeahead
          id="typeahead-single"
          isMulti={false}
          closeMenuOnSelect={true}
          name="typeahead"
          initialOptions={options}
          placeholder="Search..."
          label="Pick a fruit"
          data-test="test-component"
        />,
        {
          tasks: typeaheadTasks,
        }
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

    it('should highlight entered text when option is clicked and replace when new text is entered', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('Bl')
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('An')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.value', 'An')
    })
  })

  context('static multi-select', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Typeahead
          id="typeahead-multi"
          isMulti={true}
          closeMenuOnSelect={false}
          name="typeahead-ms"
          initialOptions={options}
          placeholder="Search..."
          label="Pick a fruit"
          data-test="test-component-ms"
        />,
        {
          tasks: typeaheadTasks,
        }
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

      cy.get('@component').find('[data-test="typeahead-input"]').click()

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

  context('async single-select', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Typeahead
          id="typeahead-async-single"
          isMulti={false}
          closeMenuOnSelect={true}
          name="typeahead"
          loadOptions={mockLoadOptions}
          placeholder="Search..."
          label="Pick an adviser"
          data-test="test-component"
        />,
        {
          tasks: typeaheadTasks,
        }
      )
      cy.get('[data-test="test-component"]').as('component')
    })

    it('should list no options when opened', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('not.be.visible')
    })

    it('should select an option when it is clicked', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .click()
        .type('den')
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'false')
        .click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('not.be.visible')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.attr', 'value', 'Denzil Lincoln')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .click()
        .clear()
        .type('den')
      // option should no longer be selected after input is cleared
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'false')
    })

    it('should get options when input is typed', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('den')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Dennis Kennedy')
        .next()
        .should('have.text', 'Denzil Lincoln')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .blur()
        .click()
        .should('have.attr', 'value', '')
    })

    it('should highlight entered text when option is clicked and replace when new text is entered', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('Bl')
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('An')
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.value', 'An')
    })

    it('Should show options which are disabled as disabled', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('disabled')

      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Disabled option')
        .should('have.attr', 'aria-disabled', 'true')
        .click()

      // Should not be updated as not clickable
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .should('have.attr', 'value', 'disabled')
    })
  })

  context('async multi-select', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Typeahead
          id="typeahead-async-multi-1"
          isMulti={true}
          closeMenuOnSelect={false}
          name="typeahead-async-ms"
          loadOptions={mockLoadOptions}
          placeholder="Search..."
          label="Pick an adviser"
          data-test="test-component-async-ms"
        />,
        {
          tasks: typeaheadTasks,
        }
      )
      cy.get('[data-test="test-component-async-ms"]').as('component')
    })

    it('should list no options when opened', () => {
      cy.get('@component').find('[data-test="typeahead-input"]').click()
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('not.be.visible')
    })

    it('should get options when input is typed', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('den')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Dennis Kennedy')
        .next()
        .should('have.text', 'Denzil Lincoln')
        .click()
        .should('have.attr', 'aria-selected', 'true')

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .blur()
        .click()
        .should('have.attr', 'value', '')
        .type('den')
      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .eq(1)
        .should('have.text', 'Denzil Lincoln')
        .should('have.attr', 'aria-selected', 'true')
    })

    it('should select options when clicked', () => {
      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .click()
        .type('den')
      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'false')
        .click()
        .should('have.attr', 'aria-selected', 'true')
      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Denzil Lincoln')

      // Click remove chip
      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .first()
        .find('button')
        .click()

      cy.get('@component')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)

      cy.get('@component').find('[data-test="typeahead-input"]').type('den')

      cy.get('@component')
        .find('[data-test="typeahead-menu-option"]')
        .eq(1)
        .should('have.attr', 'aria-selected', 'false')
    })
  })

  context('with different props', () => {
    function mountComponent(props) {
      cy.mountWithProvider(
        <Typeahead
          id="typeahead-async-single"
          isMulti={false}
          closeMenuOnSelect={true}
          name="typeahead"
          loadOptions={mockLoadOptions}
          placeholder="Search..."
          label="Pick an adviser"
          data-test="test-component"
          {...props}
        />,
        {
          tasks: typeaheadTasks,
        }
      )
      cy.get('[data-test="test-component"]').as('component')
    }

    it('should show metadata if showMetaData is true', () => {
      mountComponent({ showMetaData: true })

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('This has metadata')

      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .as('metadataOption')

      cy.get('@metadataOption').contains('This has metadata')

      cy.get('@metadataOption')
        .find('[data-test="metadata-label"]')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Trading name')
        .next()
        .should('have.text', 'This is an example')
        .next()
        .should('have.text', 'Address')
        .next()
        .should('have.text', 'An address')
        .click()
    })

    it('should not show metadata if showMetaData is false', () => {
      mountComponent({ showMetaData: false })

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('This has metadata')

      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 2)
        .first()
        .as('metadataOption')

      cy.get('@metadataOption').contains('This has metadata')

      cy.get('@metadataOption')
        .find('[data-test="metadata-label"]')
        .should('not.exist')
    })

    it('should show inset text if showInsetText is true', () => {
      mountComponent({ showInsetText: true })

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('This has metadata and inset text')

      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 1)
        .first()
        .as('metadataOption')

      cy.get('@metadataOption').contains('This has metadata and inset text')

      cy.get('@metadataOption')
        .find('[data-test="typeahead-inset-text"]')
        .should('have.text', 'This is some additional inset text')
    })

    it('should not show inset text if showInsetText is false', () => {
      mountComponent({ showInsetText: false })

      cy.get('@component')
        .find('[data-test="typeahead-input"]')
        .clear()
        .type('This has metadata and inset text')

      cy.get('@component')
        .find('[data-test="typeahead-menu"]')
        .should('be.visible')
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 1)
        .first()
        .as('metadataOption')

      cy.get('@metadataOption').contains('This has metadata and inset text')

      cy.get('@metadataOption')
        .find('[data-test="typeahead-inset-text"]')
        .should('not.exist')
    })
  })
})
