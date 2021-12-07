import urls from '../../../../../src/lib/urls'

const {
  assertKeyValueTable,
  assertBreadcrumbs,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Event Details', () => {
  it('should display one day event details with link to documents', () => {
    cy.visit(urls.events.details(fixtures.event.oneDayExhibition.id))

    cy.get(selectors.entityCollection.editEvent).should('be.visible')

    assertBreadcrumbs({
      Home: urls.dashboard.route,
      Events: urls.events.index(),
      'One-day exhibition': null,
    })

    assertKeyValueTable('eventDetails', {
      'Type of event': 'Exhibition',
      'Event date': '1 January 2021',
      'Event location type': 'HQ',
      Address:
        'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
      Region: 'Not set',
      Notes: 'This is a dummy event for testing.',
      'Lead team': 'CBBC Hangzhou',
      Organiser: 'John Rogers',
      'Other teams': 'CBBC HangzhouCBBC North West',
      'Related programmes': 'Grown in Britain',
      'Related Trade Agreements': 'UK - Japan',
      Service: 'Events : UK Based',
      Documents: 'View files and documents (opens in a new window or tab)',
    })

    cy.contains('a', 'View files and documents').should((el) => {
      expect(el).to.have.attr('href', '/documents/123')
      expect(el).to.have.attr('target', '_blank')
    })
  })

  describe('Disabled event with no document', () => {
    before(() => {
      cy.visit(urls.events.details(fixtures.event.teddyBearExpo.id))
    })

    it('should display no document link details', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Events: urls.events.index(),
        'Teddy bear expo': null,
      })

      assertKeyValueTable('eventDetails', {
        'Type of event': 'Exhibition',
        'Event date': '1 January 2021',
        'Event location type': 'HQ',
        Address:
          'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
        Region: 'Not set',
        Notes: 'This is a dummy event for testing.',
        'Lead team': 'CBBC Hangzhou',
        Organiser: 'John Rogers',
        'Other teams': 'CBBC HangzhouCBBC North West',
        'Related programmes': 'Grown in Britain',
        'Related Trade Agreements': 'Not set',
        Service: 'Events : UK Based',
      })
    })

    it('should hide edit event button for disabled events', () => {
      cy.get(selectors.entityCollection.editEvent).should('not.exist')
    })
  })

  describe('Certain fields that are null', () => {
    before(() => {
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
            name: 'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)',
            id: '380bba2b-3499-e211-a939-e4115bead28a',
          },
          uk_region: null,
        }
      ).as('apiRequest')
      cy.visit(urls.events.details(fixtures.event.teddyBearExpo.id))
      cy.wait('@apiRequest')
    })

    it('should set fields that are null to "Not set"', () => {
      assertKeyValueTable('eventDetails', {
        'Type of event': 'Exhibition',
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
          'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)',
      })
    })
  })
})
