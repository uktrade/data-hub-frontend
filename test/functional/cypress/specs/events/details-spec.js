import urls from '../../../../../src/lib/urls'

const {
  assertBreadcrumbs,
  assertSummaryTableStrict,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')
const event = require('../../../../sandbox/fixtures/v3/event/single-event-missing-teams.json')

const EVENT_DETAILS_ROWS = {
  'Type of event': 'Exhibition',
  'Event date': '1 January 2021',
  'Event location type': 'HQ',
  Address: 'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
  Region: 'Not set',
  Notes: 'This is a dummy event for testing.',
  'Lead team': 'CBBC Hangzhou',
  Organiser: 'John Rogers',
  'Other teams': 'CBBC HangzhouCBBC North West',
  'Related programmes': 'Grown in Britain',
  'Related Trade Agreements': 'UK - Japan',
  Service: 'Events : UK based',
}

describe('Event Details', () => {
  it('should display one day event details', () => {
    cy.visit(urls.events.details(fixtures.event.oneDayExhibition.id))

    assertBreadcrumbs({
      Home: urls.dashboard.index.route,
      Events: urls.events.index(),
      'One-day exhibition': null,
      Details: null,
    })

    assertSummaryTableStrict({
      rows: EVENT_DETAILS_ROWS,
    })

    cy.contains('a', 'Edit event')
  })

  it('should display one day event details with no teams', () => {
    cy.visit(urls.events.details(event.id))

    assertSummaryTableStrict({
      rows: {
        ...EVENT_DETAILS_ROWS,
        'Lead team': 'Not set',
        'Other teams': 'Not set',
      },
    })

    cy.contains('a', 'Edit event')
  })

  it('should display no document link details', () => {
    cy.visit(urls.events.details(fixtures.event.teddyBearExpo.id))

    assertBreadcrumbs({
      Home: urls.dashboard.index.route,
      Events: urls.events.index(),
      'Teddy bear expo': null,
      Details: null,
    })

    assertSummaryTableStrict({
      rows: {
        ...EVENT_DETAILS_ROWS,
        'Related Trade Agreements': 'Not set',
      },
    })

    cy.contains('a', 'Edit event').should('not.exist')
  })

  it('should set fields that are null to "Not set"', () => {
    cy.intercept(
      'GET',
      `/api-proxy/v4/event/${fixtures.event.teddyBearExpo.id}`,
      {
        address_1: '16 Grande Parade',
        address_2: '',
        address_country: {
          name: 'China',
          id: '63af72a6-5d95-e211-a939-e4115bead28a',
        },
        address_county: '',
        address_postcode: '',
        address_town: 'Shanghai',
        end_date: '2016-03-16',
        event_type: {
          name: 'Exhibition',
          id: '2fade471-e868-4ea9-b125-945eb90ae5d4',
        },
        lead_team: {
          name: 'UK Fashion and Textile Association Ltd (UKFT)',
          id: '23f12898-9698-e211-a939-e4115bead28a',
        },
        name: 'Shanghai Fashion Week including The Hub, Chic-Pure-Intertextile March 2016',
        notes: null,
        organiser: null,
        start_date: '2016-03-16',
        service: {
          name: 'DBT export service or funding : UK Tradeshow Programme (UKTP) – exhibitor',
          id: '380bba2b-3499-e211-a939-e4115bead28a',
        },
        uk_region: null,
      }
    )

    cy.visit(urls.events.details(fixtures.event.teddyBearExpo.id))

    assertSummaryTableStrict({
      rows: {
        ...EVENT_DETAILS_ROWS,
        'Event date': '16 March 2016',
        'Event location type': 'Not set',
        Address: '16 Grande Parade, Shanghai, China',
        Region: 'Not set',
        Notes: 'Not set',
        'Lead team': 'UK Fashion and Textile Association Ltd (UKFT)',
        Organiser: 'Not set',
        'Other teams': 'Not set',
        'Related programmes': 'Not set',
        'Related Trade Agreements': 'Not set',
        Service:
          'DBT export service or funding : UK Tradeshow Programme (UKTP) – exhibitor',
      },
    })
  })
})
