import React from 'react'

import ExportFormFields from '../../../../../src/client/modules/ExportPipeline/ExportForm/ExportFormFields'
import DataHubProvider from '../provider'

describe('ExportFormFields', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ExportFormFields
        {...props}
        taskProps={{
          // name: RESET_ACTION,
          id: 'test',
          progressMessage: 'Loading company details',
        }}
      />
    </DataHubProvider>
  )

  context('When exportItem is null', () => {
    it('should not render the <Form> component', () => {
      cy.mount(<Component exportItem={null} />)
      cy.get('form').should('not.exist')
    })
  })

  context('When exportItem is an object', () => {
    it('should render the <Form> component', () => {
      cy.mount(<Component exportItem={{ company: 1 }} />)
      cy.get('form').should('exist')
    })
  })
})
