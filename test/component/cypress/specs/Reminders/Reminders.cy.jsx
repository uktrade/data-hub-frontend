import React from 'react'

import { Reminders } from '../../../../../src/client/modules/Reminders/Reminders.jsx'
import DataHubProvider from '../provider'

describe('Reminders', () => {
  const Component = (props) => <Reminders {...props} />

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
