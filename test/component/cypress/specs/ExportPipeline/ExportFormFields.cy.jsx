import React from 'react'

import ExportFormFields from '../../../../../src/client/modules/ExportPipeline/ExportForm/ExportFormFields'

describe('ExportFormFields', () => {
  context('When exportItem is null', () => {
    it('should not render the <Form> component', () => {
      cy.mountWithProvider(
        <ExportFormFields
          exportItem={null}
          taskProps={{
            id: 'test',
            progressMessage: 'Loading company details',
          }}
        />
      )
      cy.get('form').should('not.exist')
    })
  })

  context('When exportItem is an object', () => {
    it('should render the <Form> component', () => {
      cy.mountWithProvider(
        <ExportFormFields
          exportItem={{ company: 1 }}
          taskProps={{
            id: 'test',
            progressMessage: 'Loading company details',
          }}
        />
      )
      cy.get('form').should('exist')
    })
  })
})
