import React from 'react'
import { compact } from 'lodash'

import { formatStartAndEndDate } from '../../../../../../src/client/components/ActivityFeed/activities/date'
import { EventDetails } from '../../../../../../src/client/modules/Events/StovaEventDetails/EventDetails'
import { getExternalStovaLink } from '../../../../../../src/client/modules/Events/StovaEventDetails/constants'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../../src/client/utils/date-utils'

const {
  assertSummaryTableStrict,
} = require('../../../../../functional/cypress/support/assertions')

describe('StovaEventDetails', () => {
  let stovaEvent

  context('When component loads the event details table', () => {
    beforeEach(() => {
      stovaEvent = {
        stovaEventId: 'a-stova-event-id',
        name: 'this is a stova event',
        datahubEvent: { id: 'a-datahub-event' },
        locationAddress1: 'An address 1',
        locationAddress2: 'An address 2',
        locationAddress3: 'An address 3',
        locationCity: 'city',
        locationPostcode: 'AA1 1AA',
        locationState: '',
        locationCountry: 'UK',
        startDate: '2018-12-10T13:45:00.000Z',
        endDate: '2018-12-10T17:45:00.000Z',
        locationName: 'OAB',
        approvalRequired: 'true',
        closeDate: '2018-12-10T13:45:00.000Z',
        code: '123456',
        contactInfo: 'a contact for stova event',
        defaultLanguage: 'en',
        description: 'This is an event to have an event',
        priceType: 'Free',
        standardCurrency: 'GBP',
        liveDate: '2018-12-10T13:45:00.000Z',
        folderId: '1231455',
        maxReg: '20',
        city: 'London',
        timezone: 'UTC',
        createdBy: '12343578',
        createdDate: '2018-12-10T13:45:00.000Z',
        modifiedBy: '1231358',
        modifiedDate: '2018-12-10T13:45:00.000Z',
        eventDate: 'eventDate',
      }
    })

    it('should render the table with not set for fields missing data', () => {
      cy.mountWithProvider(<EventDetails stovaEvent={''} />)
      assertSummaryTableStrict({
        caption: '',
        rows: [
          ['Name', 'Not set'],
          ['Event date', 'Not set'],
          ['Event location name', 'Not set'],
          ['Location Address', 'Not set'],
          ['Stova reference number', 'Not set'],
          ['Approval Required', 'Not set'],
          ['Close Date', 'Not set'],
          ['Code', 'Not set'],
          ['Contact Info', 'Not set'],
          ['Default Language', 'Not set'],
          ['Description', 'Not set'],
          ['Price Type', 'Not set'],
          ['Standard Currency', 'Not set'],
          ['Live Date', 'Not set'],
          ['Folder ID', 'Not set'],
          ['Max Reg', 'Not set'],
          ['Address', 'Not set'],
          ['Timezone', 'Not set'],
          ['Created By', 'Not set'],
          ['Created Date', 'Not set'],
          ['Modified By', 'Not set'],
          ['Modified Date', 'Not set'],
        ],
      })
    })

    it('should render the table with not set for fields missing data', () => {
      const eventDate = formatStartAndEndDate(
        stovaEvent.startDate,
        stovaEvent.endDate
      )
      const address = compact([
        stovaEvent.locationAddress1,
        stovaEvent.locationAddress2,
        stovaEvent.locationAddress3,
        stovaEvent.locationCity,
        stovaEvent.locationPostcode,
        stovaEvent.locationState,
        stovaEvent.locationCountry,
      ])
      const stovaLink = getExternalStovaLink(stovaEvent.stovaEventId)
      cy.mountWithProvider(<EventDetails stovaEvent={stovaEvent} />)
      assertSummaryTableStrict({
        caption: '',
        rows: [
          ['Name', stovaEvent.name],
          ['Event date', eventDate],
          ['Event location name', stovaEvent.locationName],
          ['Location Address', address.join('')],
          [
            'Stova reference number',
            `${stovaEvent.stovaEventId} View in Stova (opens in new tab)`,
          ],
          ['Approval Required', stovaEvent.approvalRequired],
          [
            'Close Date',
            formatDate(stovaEvent.closeDate, DATE_FORMAT_MEDIUM_WITH_TIME),
          ],
          ['Code', stovaEvent.code],
          ['Contact Info', stovaEvent.contactInfo],
          ['Default Language', stovaEvent.defaultLanguage],
          ['Description', stovaEvent.description],
          ['Price Type', stovaEvent.priceType],
          ['Standard Currency', stovaEvent.standardCurrency],
          [
            'Live Date',
            formatDate(stovaEvent.liveDate, DATE_FORMAT_MEDIUM_WITH_TIME),
          ],
          ['Folder ID', stovaEvent.folderId],
          ['Max Reg', stovaEvent.maxReg],
          [
            'Address',
            compact([
              stovaEvent.city,
              stovaEvent.country,
              stovaEvent.state,
            ]).join(''),
          ],
          ['Timezone', stovaEvent.timezone],
          ['Created By', stovaEvent.createdBy],
          [
            'Created Date',
            formatDate(stovaEvent.createdDate, DATE_FORMAT_MEDIUM_WITH_TIME),
          ],
          ['Modified By', stovaEvent.modifiedBy],
          [
            'Modified Date',
            formatDate(stovaEvent.modifiedDate, DATE_FORMAT_MEDIUM_WITH_TIME),
          ],
        ],
      })

      cy.get('[data-test="newWindowLink"]')
        .should('have.attr', 'href', stovaLink)
        .should('have.text', 'View in Stova (opens in new tab)')
    })
  })
})
