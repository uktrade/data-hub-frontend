import React from 'react'
import { RemindersRoutes } from '../../../../../src/client/modules/Reminders/RemindersRoutes.jsx'
import DataHubProvider from '../provider'

describe('RemindersMenu', () => {
  const Component = (props) => <RemindersRoutes {...props} />

  context('When reminderType is missing', () => {
    beforeEach(() => {
      cy.intercept('/default/url/here', '<h1>success<h1>')
      cy.mount(
        <DataHubProvider>
          <Component defaultUrl={'/default/url/here'} />
        </DataHubProvider>
      )
    })
    it('should return a redirect to the defaultUrl', () => {
      cy.location('pathname').should('eq', '/default/url/here')
    })
  })
})
