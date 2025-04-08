import 'cypress-axe'

import React from 'react'

import ExportFormFields from '../../../../../../src/client/modules/ExportPipeline/ExportForm/ExportFormFields'

describe('Accessibility: Export Form', () => {
  it('renders export value fieldset with correct structure and passes a11y checks', () => {
    cy.mountWithProvider(
      <ExportFormFields
        exportItem={{ id: '123', company: { id: 'company-1' } }}
        taskProps={{
          id: 'test',
          progressMessage: 'Loading company details',
        }}
      />
    )

    cy.injectAxe()

    // Check fieldset structure
    cy.get('#field-estimated_export')
      .should('exist')
      .within(() => {
        cy.get('fieldset').should('exist')
        cy.get('legend label')
          .should('exist')
          .and('contain.text', 'Total estimated export value')
        cy.get('label[for="estimated_export_value_years"]').should('exist')
        cy.get('#estimated_export_value_years').should('exist')
      })

    // Accessibility check on the field group
    cy.checkA11y('#field-estimated_export', {
      includedImpacts: ['critical', 'serious'],
    })
  })
})
