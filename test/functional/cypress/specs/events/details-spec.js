const { assertKeyValueTable } = require('../../support/assertions')

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Event Details', () => {
  it('should display event details', () => {
    cy.visit(`/events/${fixtures.event.oneDayExhibition.id}/details`)

    cy.get(selectors.entityCollection.editEvent).should('be.visible')

    assertKeyValueTable('bodyMainContent', {
      'Type of event': 'Exhibition',
      'Event date': '1 January 2021',
      'Event location type': 'HQ',
      Address:
        'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
      Region: '',
      Notes: 'This is a dummy event for testing.',
      'Lead team': 'CBBC Hangzhou',
      Organiser: 'John Rogers',
      'Other teams': 'CBBC North West',
      'Related programmes': 'Grown in Britain',
      'Related Trade Agreements': 'UK - Japan',
      Service: 'Events : UK Based',
      Documents: 'View files and documents (will open another website)',
    })
  })

  describe('Disabled event with no document', () => {
    before(() => {
      cy.visit(`/events/${fixtures.event.teddyBearExpo.id}/details`)
    })

    it('should display no document link details', () => {
      assertKeyValueTable('bodyMainContent', {
        'Type of event': 'Exhibition',
        'Event date': '1 January 2021',
        'Event location type': 'HQ',
        Address:
          'Day Court Exhibition Centre, Day Court Lane, China, SW9 9AB, China',
        Region: '',
        Notes: 'This is a dummy event for testing.',
        'Lead team': 'CBBC Hangzhou',
        Organiser: 'John Rogers',
        'Other teams': 'CBBC North West',
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
