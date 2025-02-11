import urls from '../../../../../src/lib/urls'

const {
  assertBreadcrumbs,
  assertSummaryTableStrict,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')

const EVENT_DETAILS_ROWS = {
  Name: 'Stova Event',
  'Event date': '11 Feb 2014 to 11 Feb 2018',
  'Event location name': 'OAB',
  'Location Address': 'An address 1An address 2An address 3cityAA1 1AAUK',
  'Stova reference number': 'a-stova-event-id View in Stova (opens in new tab)',
  'Approval Required': 'true',
  'Close Date': '11 Feb 2019, 11:30am',
  Code: '123456',
  'Contact Info': 'a contact for stova event',
  'Default Language': 'en',
  Description: 'This is an event to have an event',
  'Price Type': 'Free',
  'Standard Currency': 'GBP',
  'Live Date': '11 Feb 2014, 11:30am',
  'Folder ID': '1231455',
  'Max Reg': '20',
  Address: 'London',
  Timezone: 'UTC',
  'Created By': '12343578',
  'Created Date': '11 Feb 2014, 11:30am',
  'Modified By': '1231358',
  'Modified Date': '11 Feb 2014, 11:30am',
}

describe('Stova Event Details', () => {
  it('should display event details with correct stova details', () => {
    // cy.intercept('GET', '/api-proxy/v4/event/*').as('getEventHttpRequest')
    cy.visit(urls.events.stova.details(fixtures.event.stovaEvent.id))
    assertBreadcrumbs({
      Home: urls.dashboard.index.route,
      Events: urls.events.index(),
      'Stova Event': null,
      Details: null,
    })

    assertSummaryTableStrict({
      rows: EVENT_DETAILS_ROWS,
    })
  })
})
