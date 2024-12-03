import React from 'react'

import AventriAttendee from '../../../../../../src/client/components/ActivityFeed/activities/AventriAttendee'
import urls from '../../../../../../src/lib/urls'

// TODO - Repurpose this test when we have the Aventri integration back
describe.skip('AventriAttendee', () => {
  const Component = (props) => <AventriAttendee {...props} />
  const activity = {
    id: 'dit:aventri:Event:1111:Attendee:1111:Create',
    object: {
      'dit:aventri:email': 'johndoe@outlook.com',
      'dit:firstName': 'Firstname1',
      'dit:lastName': 'Lastname1',
      'dit:registrationStatus': 'Confirmed',
      'dit:emailAddress': 'johndoe@outlook.com',
      id: 'dit:aventri:Attendee:1111',
      attributedTo: {
        id: 'dit:aventri:Attendee:1111',
      },
    },
    startDate: '2022-02-24T11:28:57',
    endDate: '2023-01-01T11:28:57',
  }

  context('when there is no event name', () => {
    beforeEach(() => {
      delete activity.eventName
      cy.mount(<Component activity={activity} />)
    })

    it('renders the contact name', () => {
      cy.get('[data-test=aventri-attendee-name]').contains(
        'Firstname1 Lastname1'
      )
    })
  })

  context('when event name exists', () => {
    beforeEach(() => {
      activity.eventName = 'test event name'
      cy.mount(<Component activity={activity} />)
    })

    it('should have a link to the event page', () => {
      const eventId = '1111'
      cy.get('[data-test="activity-card-subject"] > a').should(
        'have.attr',
        'href',
        urls.events.aventri.details(eventId)
      )
    })

    it('should display the Events label', () => {
      cy.get('[data-test="aventri-activity"]').within(() => {
        cy.get('[data-test="activity-service-label"]').contains('event', {
          matchCase: false,
        })
      })
    })

    it('should display the Interaction Kind label when registration status is not Attended', () => {
      cy.get('[data-test="aventri-activity"]').within(() => {
        cy.get('[data-test="activity-kind-label"]').contains('interaction', {
          matchCase: false,
        })
      })
    })

    it('should display the registration status', () => {
      cy.get('[data-test="aventri-activity"]').contains(
        'test event name: Registered'
      )
    })

    context('when the registration status is Attended', () => {
      beforeEach(() => {
        activity.object['dit:registrationStatus'] = 'Attended'
        cy.mount(<Component activity={activity} />)
      })

      it('should display the Aventri Event label when registration status is Attended', () => {
        cy.get('[data-test="aventri-activity"]').within(() => {
          cy.get('[data-test="activity-kind-label"]').contains(
            'Aventri Event',
            {
              matchCase: false,
            }
          )
        })
      })
    })

    context('when there is no registration status', () => {
      beforeEach(() => {
        activity.object['dit:registrationStatus'] = undefined
        cy.mount(<Component activity={activity} />)
      })

      it('does not display the registration info', () => {
        cy.get('[data-test="aventri-activity"]').contains('test event name')
        cy.get('[data-test="aventri-activity"]').should('not.have.text', ':')
      })
    })
  })
})
