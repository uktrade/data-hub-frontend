import {
  assertLocalHeader,
  assertBreadcrumbs,
} from '../../../cypress/support/assertions'

import {
  assertEventFormFields,
  assertTextVisible,
  assertVisible,
  assertNotExists,
  assertErrorSummary,
  assertEventRequestBody,
} from '../../../cypress/support/event-assertions'

import {
  fillAndAssertRelatedTradeAgreements,
  fillCountry,
  fillEventSharedRadio,
  fillAndAssertSharedTeams,
  fillAndAssertProgrammes,
  fillHasRelatedTradeAgreementsRadio,
  fillStartDateWith,
  fillEndDateWith,
  fillEventForm,
  clickAddEventButton,
} from '../../../cypress/support/form-fillers'

describe('Event create', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/event').as('eventHttpRequest')
    cy.visit('/events/create')
  })

  it('should render the header', () => {
    assertLocalHeader('Add event')
  })

  it('should render add event breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: '/events?page=1&sortby=modified_on:desc',
      'Add event': null,
    })
  })

  it('should render expected form fields with default values ', () => {
    assertEventFormFields()
  })

  it('should contain trade agreement guidance', () => {
    assertTextVisible(
      'If your Event is set up to focus on a Trade Agreement or contributes to implementing a Trade Agreement then select that the event relates to a Trade Agreement and the relevant Agreement(s)'
    )
    assertTextVisible('See more guidance')
    cy.contains('See more guidance')
      .should('have.attr', 'href')
      .should(
        'contain',
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
      )
    cy.contains('See more guidance').should(
      'have.attr',
      'aria-label',
      'Opens in a new window or tab'
    )
    assertTextVisible('(opens in a new window or tab)')
  })

  it('should allow a user to add multiple named trade agreements', () => {
    fillAndAssertRelatedTradeAgreements([
      'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
      'UK-Australia Mutual Recognition Agreement',
    ])
  })

  it('should toggle uk region field', () => {
    fillCountry('United Kingdom')
    cy.get('#field-address_country').should('contain', 'United Kingdom')
    assertVisible('#uk_region')

    fillCountry('Uganda')
    cy.get('#field-address_country').should('contain', 'Uganda')
    assertNotExists('#uk_region')
  })

  it('should toggle teams section when interacting with shared options', () => {
    assertTextVisible('Is this a shared event? (optional)')
    fillEventSharedRadio(true)
    assertVisible('#teams')

    fillEventSharedRadio(false)
    assertNotExists('#teams')
  })

  it('should allow user to add multiple shared teams', () => {
    fillAndAssertSharedTeams(['BPI', 'BN Americas'])
  })

  it('should allow user to add multiple programmes', () => {
    fillAndAssertProgrammes(['CEN Energy', 'CEN Services'])
  })

  context('when verifying inputs', () => {
    it('should validate an empty form', () => {
      clickAddEventButton()

      assertErrorSummary([
        'Answer if the event is related to a trade agreement',
        'Event name may not be null',
        'Select at least one event type',
        'Enter a valid start date',
        'Enter a valid end date',
        'Address line 1 may not be null',
        'Town or city may not be null',
        'Postcode may not be null',
        'Country may not be null',
        'Select at least one team hosting the event',
        'Select at least one service',
        'Type at least one organiser',
        'Programme can not be null',
      ])
    })

    it('should validate dates and other radio fields when selected', () => {
      fillHasRelatedTradeAgreementsRadio(true)
      fillEventSharedRadio(true)
      fillStartDateWith('12', '12', '2021')
      fillEndDateWith('11', '11', '2021')

      clickAddEventButton()

      assertErrorSummary([
        'Event name may not be null',
        'Select at least one event type',
        'Enter a valid end date. This must be after the start date.',
        'Address line 1 may not be null',
        'Town or city may not be null',
        'Postcode may not be null',
        'Country may not be null',
        'Select at least one team hosting the event',
        'Select at least one service',
        'Type at least one organiser',
        'Programme can not be null',
        'Trade Agreement can not be null',
        'Team can not be null',
      ])
    })
  })

  // TODO: Add more edge cases to extend Transformations possibilities
  // TODO: Move this to JSON scenarios to load generically
  context('when filling in a valid event form', () => {
    it('should save with expected values and endpoint', () => {
      fillEventForm({
        address1: 'Bussiness 1',
        address2: 'Street 2',
        country: 'United Kingdom',
        county: 'County',
        postcode: 'POST CODE',
        town: 'Town & City',
        region: 'London',
        endDate: {
          year: '2021',
          month: '12',
          day: '13',
        },
        eventType: 'Exhibition',
        leadTeam: 'Advanced Manufacturing Sector',
        locationType: 'HQ',
        eventName: 'Test Create Event',
        notes: 'Testing a valid form for all fields',
        organiser: 'Violet Roy',
        hasRelatedTradeAgreements: true,
        // Test duplicates
        relatedTradeAgreements: [
          'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
          'UK-Australia Mutual Recognition Agreement',
          'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
        ],
        relatedProgrammes: ['Aid Funded Business Service (AFBS)', 'CEN Energy'],
        startDate: {
          year: '2021',
          month: '12',
          day: '12',
        },
        eventShared: true,
        teams: ['BPI', 'BN America'],
        service: 'Making Other Introductions : UK Export Finance (UKEF)',
      })

      clickAddEventButton()

      const expectedBody = {
        address_1: 'Bussiness 1',
        address_2: 'Street 2',
        address_country: {
          value: '80756b9a-5d95-e211-a939-e4115bead28a',
          label: 'United Kingdom',
        },
        address_county: 'County',
        address_postcode: 'POST CODE',
        address_town: 'Town & City',
        end_date: {
          year: '2021',
          month: '12',
          day: '13',
        },
        event_type: {
          value: '2fade471-e868-4ea9-b125-945eb90ae5d4',
          label: 'Exhibition',
        },
        lead_team: {
          value: '08c14624-2f50-e311-a56a-e4115bead28a',
          label: 'Advanced Manufacturing Sector',
        },
        location_type: {
          value: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
          label: 'HQ',
        },
        name: 'Test Create Event',
        notes: 'Testing a valid form for all fields',
        organiser: {
          value: '3442c516-9898-e211-a939-e4115bead28a',
          label: 'Violet Roy',
        },
        has_related_trade_agreements: 'yes',
        related_trade_agreements: [
          {
            value: 'af704a93-5404-4bc6-adda-381756993902',
            label:
              'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
          },
          {
            value: '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
            label: 'UK-Australia Mutual Recognition Agreement',
          },
        ],
        related_programmes: [
          {
            value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
            label: 'Aid Funded Business Service (AFBS)',
          },
          {
            value: '058dde7c-19d5-e311-8a2b-e4115bead28a',
            label: 'CEN Energy',
          },
        ],
        start_date: {
          year: '2021',
          month: '12',
          day: '12',
        },
        teams: [
          {
            value: 'bb65239e-9698-e211-a939-e4115bead28a',
            label: 'BPI',
          },
          {
            value: '06374ae0-9698-e211-a939-e4115bead28a',
            label: 'BN America',
          },
        ],
        service: {
          value: '6fd4b203-8e73-4a39-96ea-188bdb623b69',
          label: 'Making Other Introductions : UK Export Finance (UKEF)',
        },
        uk_region: {
          value: '874cd12a-6095-e211-a939-e4115bead28a',
          label: 'London',
        },
        event_shared: 'yes',
      }
      assertEventRequestBody(expectedBody, (xhr) => {
        assertRedirectUrl(urls.events.detail(xhr.response.body.id))
        assertTextVisible(`'Test Create Event' event has been created`)
      })
    })
  })
})
