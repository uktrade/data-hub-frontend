import React from 'react'
import ExportFormFields from '../../../../../src/client/modules/ExportPipeline/ExportForm/ExportFormFields'
import DataHubProvider from '../provider'

const RESET_ACTION = {
  type: 'RESET',
}

describe('ExportFormFields', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ExportFormFields
        {...props}
        taskProps={{
          name: RESET_ACTION,
          id: 'test',
          progressMessage: 'Loading company details',
        }}
      />
    </DataHubProvider>
  )

  context('When formDataLoaded is false', () => {
    it('should not render the <Form> component', () => {
      cy.mount(<Component formDataLoaded={false} />)
      cy.get('form').should('not.exist')
    })
  })

  context('When formDataLoaded is true', () => {
    it('should render the <Form> component', () => {
      cy.mount(<Component formDataLoaded={true} />)
      cy.get('form').should('exist')
    })
  })
})
