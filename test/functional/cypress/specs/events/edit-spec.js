import {
  assertLocalHeader,
  assertBreadcrumbs,
  assertTextVisible,
  assertUrl,
} from '../../../cypress/support/assertions'
import {
  assertEventFormFields,
  assertEventRequestBody,
} from '../../../cypress/support/event-assertions'
import {
  clickSaveAndReturnButton,
  clickReturnWithoutSavingButton,
} from '../../../cypress/support/form-fillers'
import urls from '../../../../../src/lib/urls'

describe('Event edit', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v4/event/*').as('eventHttpRequest')
    cy.intercept('GET', '/api-proxy/v4/event/*').as('getEventHttpRequest')
    cy.visit('/events/8253a4d2-0a61-4928-80cb-ebd70cce9971/edit')
  })

  it('should render the header', () => {
    assertLocalHeader('Edit event')
  })

  it('should render add event breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: '/events?page=1&sortby=modified_on:desc',
      'Edit event': null,
    })
  })

  it('should render a meta title', () => {
    cy.title().should('eq', 'Edit event - Events - DBT Data Hub')
  })

  context('when loading in a valid event form', () => {
    it('should render expected form fields with original values ', () => {
      cy.wait('@getEventHttpRequest')
      assertEventFormFields({
        hasRelatedTradeAgreement: 'No',
        eventName: 'One-day exhibition',
        eventType: 'Exhibition',
        startDate: { day: '01', month: '01', year: '2021' },
        endDate: { day: '01', month: '01', year: '2021' },
        locationType: 'HQ',
        street1: 'Day Court Exhibition Centre',
        street2: 'Day Court Lane',
        town: 'China',
        county: '',
        postcode: 'SW9 9AB',
        country: 'China',
        notes: 'This is a dummy event for testing.',
        leadTeam: 'CBBC Hangzhou',
        service: 'Events : UK based',
        organiser: 'John Rogers',
        isEventShared: 'Yes',
        teams: ['CBBC HangZhou', 'CBBC North West'],
        relatedProgrammes: 'Grown in Britain',
      })
    })

    it('should save with expected values and endpoint', () => {
      const expectedBody = {
        id: '63af73a6-5d95-e211-aaaa-e4115bead28a',
        address_1: 'Day Court Exhibition Centre',
        address_2: 'Day Court Lane',
        address_country: '63af72a6-5d95-e211-a939-e4115bead28a',
        address_county: '',
        address_postcode: 'SW9 9AB',
        address_town: 'China',
        end_date: '2021-01-01',
        event_type: '2fade471-e868-4ea9-b125-945eb90ae5d4',
        lead_team: '5d4d24c2-9698-e211-a939-e4115bead28a',
        location_type: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
        name: 'One-day exhibition',
        notes: 'This is a dummy event for testing.',
        organiser: '7bad8082-4978-4fe8-a018-740257f01637',
        related_programmes: ['d352a68f-aaf4-4c43-b39d-9bca67a8322e'],
        related_trade_agreements: [],
        start_date: '2021-01-01',
        teams: [
          '5d4d24c2-9698-e211-a939-e4115bead28a',
          '4e4d24c2-9698-e211-a939-e4115bead28a',
        ],
        service: '9584b82b-3499-e211-a939-e4115bead28a',
        uk_region: null,
        has_related_trade_agreements: false,
        event_shared: true,
      }

      clickSaveAndReturnButton()

      assertEventRequestBody(expectedBody, (xhr) => {
        assertUrl(urls.events.details(xhr.response.body.id))
        assertTextVisible(`'One-day exhibition' event has been updated`)
      })
    })
  })

  context('when a user cancels', () => {
    it('should return without saving and return to the correct endpoint', () => {
      clickReturnWithoutSavingButton()
      assertUrl(urls.events.details('8253a4d2-0a61-4928-80cb-ebd70cce9971'))
    })
  })
})
