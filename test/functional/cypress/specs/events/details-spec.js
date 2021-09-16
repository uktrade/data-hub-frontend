import urls from '../../../../../src/lib/urls'

const {
  assertKeyValueTable,
  assertBreadcrumbs,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Event Details', () => {
  it('should display event details with link to documents', () => {
    cy.visit(urls.events.details(fixtures.event.oneDayExhibition.id))

    cy.get(selectors.entityCollection.editEvent).should('be.visible')

    assertBreadcrumbs({
      Home: urls.dashboard.route,
      Events: '/events',
      'One-day exhibition': null,
    })

    assertKeyValueTable('eventDetails', {
      'Type of event': 'Exhibition',
      'Event date': '1 January 2021',
      'Event location type': 'HQ',
      Address:
        'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
      Region: '',
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
        Events: '/events',
        'Teddy bear expo': null,
      })

      assertKeyValueTable('eventDetails', {
        'Type of event': 'Exhibition',
        'Event date': '1 January 2021',
        'Event location type': 'HQ',
        Address:
          'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
        Region: '',
        Notes: 'This is a dummy event for testing.',
        'Lead team': 'CBBC Hangzhou',
        Organiser: 'John Rogers',
        'Other teams': 'CBBC HangzhouCBBC North West',
        'Related programmes': 'Grown in Britain',
        'Related Trade Agreements': '',
        Service: 'Events : UK Based',
      })
    })

    it('should hide edit event button for disabled events', () => {
      cy.get(selectors.entityCollection.editEvent).should('not.exist')
    })
  })
})
