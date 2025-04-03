import {
  assertLocalHeader,
  assertBreadcrumbs,
  assertErrorSummary,
  assertVisible,
  assertNotExists,
  assertTextVisible,
  assertUrl,
} from '../../../cypress/support/assertions'

import {
  assertEventFormFields,
  assertEventRequestBody,
} from '../../../cypress/support/event-assertions'

import urls from '../../../../../src/lib/urls'

import {
  fillAndAssertRelatedTradeAgreements,
  fillCountryWithLegend,
  fillEventSharedRadio,
  fillAndAssertSharedTeams,
  fillAndAssertProgrammes,
  fillHasRelatedTradeAgreementsRadio,
  fillStartDateWith,
  fillEndDateWith,
  fillEventForm,
  clickAddEventButton,
} from '../../../cypress/support/eventform-fillers'
import { clickReturnWithoutSavingButton } from '../../../cypress/support/form-fillers'
import { UK_REGIONS } from '../../../../../src/common/constants'

const selectors = require('../../../../selectors/event/createOrEdit')

describe('Event create', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/event').as('eventHttpRequest')
    cy.visit('/events/create')
  })

  it('should render the header', () => {
    assertLocalHeader('Add event')
  })

  it('should render a meta title', () => {
    cy.title().should('eq', 'Add event - Events - DBT Data Hub')
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

  it('should allow a user to add multiple named trade agreements', () => {
    fillAndAssertRelatedTradeAgreements([
      'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
      'UK-Australia Mutual Recognition Agreement',
    ])
  })

  it('should show "No trade agreement found" value not found', () => {
    fillHasRelatedTradeAgreementsRadio(true)

    cy.get(selectors.relatedTradeAgreementsFieldId).type('Non existant field')

    assertVisible('span', 'No trade agreements found')
  })

  it('should show "No event type found" value not found', () => {
    cy.get(selectors.eventTypeFieldId).type('Non existant field')

    assertVisible('span', 'No event type found')
  })

  it('should show "No event location found" when value not found', () => {
    cy.get(selectors.locationTypeFieldId).type('Non existant field')

    assertVisible('span', 'No event location found')
  })

  it('should show "No country found" when value not found', () => {
    cy.get(selectors.addressCountryFieldId).type('Non existant field')

    assertVisible('span', 'No country found')
  })

  it('should show "No region found" when value not found', () => {
    fillCountryWithLegend('United Kingdom')

    cy.get(selectors.ukRegionFieldId)
      .children()
      .first()
      .type('Non existant field')

    assertVisible('span', 'No region found')
  })

  it('should show "No hosting team found" when value not found', () => {
    cy.get(selectors.leadTeamFieldId).type('Non existant field')

    assertVisible('span', 'No hosting team found')
  })

  it('should show "No service found" when value not found', () => {
    cy.get(selectors.serviceFieldId).type('Non existant field')

    assertVisible('span', 'No service found')
  })

  it('should show "No shared team found" when value not found', () => {
    fillEventSharedRadio(true)

    cy.get(selectors.teamsFieldId).type('Non existant field')

    assertVisible('span', 'No shared team found')
  })

  it('should show "No programmes found" when value not found', () => {
    cy.get(selectors.relatedProgrammesFieldId).type('Non existant field')

    assertVisible('span', 'No programmes found')
  })

  it('should toggle uk region field', () => {
    fillCountryWithLegend('United Kingdom')
    cy.get(selectors.addressCountryFieldId)
      .find('input')
      .should('have.attr', 'value', 'United Kingdom')
    assertVisible(selectors.ukRegionId)

    fillCountryWithLegend('Uganda')
    cy.get(selectors.addressCountryFieldId)
      .find('input')
      .should('have.attr', 'value', 'Uganda')
    assertNotExists(selectors.ukRegionId)
  })

  it('should toggle teams section when interacting with shared options', () => {
    assertTextVisible('Is this a shared event? (optional)')
    fillEventSharedRadio(true)
    assertVisible(selectors.teamsId)

    fillEventSharedRadio(false)
    assertNotExists(selectors.teamsId)
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
        'Enter an event name',
        'Select at least one event type',
        'Enter a valid start date',
        'Enter a valid end date',
        'Enter an Address line 1',
        'Enter a town or city',
        'Enter a postcode',
        'Enter a country',
        'Select at least one team hosting the event',
        'Select at least one service',
        'Enter at least one organiser',
      ])
    })

    it('should validate dates, uk regions and other radio fields when selected', () => {
      fillHasRelatedTradeAgreementsRadio(true)
      fillEventSharedRadio(true)
      fillStartDateWith('12', '12', '2021')
      fillEndDateWith('11', '11', '2021')
      fillCountryWithLegend('United Kingdom')

      clickAddEventButton()

      assertErrorSummary([
        'Enter an event name',
        'Select at least one event type',
        'Enter a valid end date. This must be after the start date.',
        'Enter an Address line 1',
        'Enter a town or city',
        'Enter a postcode',
        'Select at least one team hosting the event',
        'Select at least one service',
        'Enter at least one organiser',
        'Select at least one trade agreement',
        'Select at least one team',
        'Select a UK region',
      ])
    })
  })

  context('when filling in a valid event form', () => {
    it('should save with expected values and endpoint', () => {
      // it automatically submits the form
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
        relatedTradeAgreements: [
          'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
          'UK-Australia Mutual Recognition Agreement',
        ],
        relatedProgrammes: ['CEN Energy', 'CEN Services'],
        startDate: {
          year: '2021',
          month: '12',
          day: '12',
        },
        eventShared: true,
        teams: ['BPI', 'BN America', 'Advanced Manufacturing Sector'],
        service: 'Events : Market visit',
      })

      cy.get('[data-test="submit-button"]').click()

      const expectedBody = {
        has_related_trade_agreements: true,
        name: 'Test Create Event',
        event_type: '2fade471-e868-4ea9-b125-945eb90ae5d4',
        start_date: '2021-12-12',
        end_date: '2021-12-13',
        location_type: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
        address_1: 'Bussiness 1',
        address_2: 'Street 2',
        address_town: 'Town & City',
        address_county: 'County',
        address_postcode: 'POST CODE',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        notes: 'Testing a valid form for all fields',
        lead_team: '08c14624-2f50-e311-a56a-e4115bead28a',
        service: '340bba2b-3499-e211-a939-e4115bead28a',
        organiser: '3442c516-9898-e211-a939-e4115bead28a',
        event_shared: true,
        related_programmes: [
          '058dde7c-19d5-e311-8a2b-e4115bead28a',
          'cad5df2e-1ad5-e311-8a2b-e4115bead28a',
        ],
        related_trade_agreements: [
          'af704a93-5404-4bc6-adda-381756993902',
          '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
        ],
        uk_region: UK_REGIONS.LONDON,
        teams: [
          'bb65239e-9698-e211-a939-e4115bead28a',
          '06374ae0-9698-e211-a939-e4115bead28a',
          '08c14624-2f50-e311-a56a-e4115bead28a',
        ],
      }
      assertEventRequestBody(expectedBody, (xhr) => {
        assertUrl(urls.events.details(xhr.response.body.id))
        assertTextVisible(`'One-day exhibition' event has been created`)
      })
    })
  })

  context('when a user cancels', () => {
    it('should return without saving and return to the correct endpoint', () => {
      clickReturnWithoutSavingButton()
      assertUrl(urls.events.index())
    })
  })
})
