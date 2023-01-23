import React from 'react'
import { RemindersLists } from '../../../../../src/client/modules/Reminders/RemindersLists.jsx'
import DataHubProvider from '../provider'

describe('RemindersMenu', () => {
  const Component = (props) => <RemindersLists {...props} />

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
