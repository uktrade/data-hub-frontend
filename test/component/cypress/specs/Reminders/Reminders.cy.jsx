import React from 'react'

import { Reminders } from '../../../../../src/client/modules/Reminders/Reminders.jsx'

describe('Reminders', () => {
  context('When reminderType is missing', () => {
    beforeEach(() => {
      cy.intercept('/default/url/here', '<h1>success<h1>')
      cy.mountWithProvider(<Reminders defaultUrl={'/default/url/here'} />, {
        initialPath: '/default/url/here',
      })
    })
    it('should return a redirect to the defaultUrl', () => {
      cy.location('pathname').should('eq', '/default/url/here')
    })
  })
})
