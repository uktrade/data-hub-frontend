import React from 'react'

import urls from '../../../../../../src/lib/urls'
import { StovaEventDetailsPage } from '../../../../../../src/client/modules/Events/StovaEventDetails'

const {
  assertBreadcrumbs,
  assertLocalHeader,
  assertFlashMessage,
} = require('../../../../../functional/cypress/support/assertions')

describe('StovaEventDetailsPage', () => {
  let stovaEvent

  context('When component loads the initial page', () => {
    beforeEach(() => {
      stovaEvent = {
        stovaEventId: 'a-stova-event-id',
        name: 'this is a stova event',
        datahubEvent: { id: 'a-datahub-event' },
      }
    })

    it('should render the component with the detail layout', () => {
      cy.mountWithProvider(
        <StovaEventDetailsPage stovaEvent={stovaEvent} path={'details'} />
      )
      cy.get('[data-test="tablist"] button').contains('Details').click()
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Events: urls.events.index(),
        [stovaEvent.name]: null,
        Details: null,
      })

      assertLocalHeader(stovaEvent.name)

      cy.get('[data-test="tablist"]')
        .should('exist')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 2)
        .first()
        .should('have.text', 'Details')
        .next()
        .should('have.text', 'Attendees')

      assertFlashMessage(
        'This event has been automatically synced from Stova. Event details and attendees can only be edited in Stova.'
      )
      cy.get('[data-test="newWindowLink"]').should(
        'have.attr',
        'href',
        urls.external.stova('a-stova-event-id')
      )
    })

    it('should render the component with the attendee layout', () => {
      cy.mountWithProvider(
        <StovaEventDetailsPage stovaEvent={stovaEvent} path={'attendees'} />
      )
      cy.get('[data-test="tablist"] button').contains('Attendees').click()

      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Events: urls.events.index(),
        [stovaEvent.name]: null,
        Attendees: null,
      })

      assertLocalHeader(stovaEvent.name)

      cy.get('[data-test="tablist"]')
        .should('exist')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 2)
        .first()
        .should('have.text', 'Details')
        .next()
        .should('have.text', 'Attendees')

      assertFlashMessage(
        'This event has been automatically synced from Stova. Event details and attendees can only be edited in Stova.'
      )
      cy.get('[data-test="newWindowLink"]').should(
        'have.attr',
        'href',
        'https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=a-stova-event-id'
      )
    })
  })
})
