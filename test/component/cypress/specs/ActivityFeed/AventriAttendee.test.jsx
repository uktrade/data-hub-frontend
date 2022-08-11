import { mount } from '@cypress/react'
import React from 'react'
import AventriAttendee from '../../../../../src/client/components/ActivityFeed/activities/AventriAttendee'

describe('AventriAttendee', () => {
  const Component = (props) => <AventriAttendee {...props} />
  const activity = {
    id: 'dit:aventri:Event:1111:Attendee:1111:Create',
    object: {
      'dit:aventri:email': 'johndoe@outlook.com',
      'dit:firstName': 'Firstname1',
      'dit:lastName': 'Lastname1',
      'dit:aventri:registrationstatus': 'Confirmed',
      'dit:emailAddress': 'johndoe@outlook.com',
      id: 'dit:aventri:Attendee:1111',
    },
    startDate: '2022-02-24T11:28:57',
    endDate: '2023-01-01T11:28:57',
  }

  context('when there is no event name', () => {
    beforeEach(() => {
      delete activity.eventName
      mount(<Component activity={activity} />)
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
      mount(<Component activity={activity} />)
    })

    it('should display event date from Aventri', () => {
      cy.get('[data-test="aventri-activity"]').contains(
        'Event date: 24 Feb 2022 to 01 Jan 2023'
      )
    })

    it('should display the Events label', () => {
      cy.get('[data-test="aventri-activity"]').within(() => {
        cy.get('[data-test="activity-service-label"]').contains('event', {
          matchCase: false,
        })
      })
    })

    it('should display the Kind label', () => {
      cy.get('[data-test="aventri-activity"]').within(() => {
        cy.get('[data-test="activity-kind-label"]').contains(
          'aventri service delivery',
          { matchCase: false }
        )
      })
    })

    it('should display the registration status', () => {
      cy.get('[data-test="aventri-activity"]').contains(
        'test event name: Registered'
      )
    })

    context('when there is no registration status', () => {
      beforeEach(() => {
        activity.object['dit:aventri:registrationstatus'] = undefined
        mount(<Component activity={activity} />)
      })

      it('does not display the registration info', () => {
        cy.get('[data-test="aventri-activity"]').contains('test event name')
        cy.get('[data-test="aventri-activity"]').should('not.have.text', ':')
      })
    })
  })
})
