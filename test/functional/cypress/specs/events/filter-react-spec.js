import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import { randomChoice } from '../../fakers/utils'
import eventTypes from '../../fixtures/metadata/event-types.json'

import {
  clickCheckboxGroupOption,
  removeChip,
  selectFirstAdvisersTypeaheadOption,
} from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertPayload,
  assertQueryParams,
} from '../../support/assertions'
import { testTypeahead } from '../../support/tests'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    archived: ['false'],
    page: 1,
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby: 'modified_on:desc',
}

const searchEndpoint = '/api-proxy/v3/search/event'
const eventTypeEndpoint = '/api-proxy/v4/metadata/event-type'

describe('events Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')

      cy.visit(urls.events.react.index())

      // Initial call to the api does not yet include default params
      // we shouldn't be making this call
      cy.wait('@apiRequest')

      // Second call to the api with default params
      assertPayload('@apiRequest', minimumPayload)
    })
  })

  context('Event Name', () => {
    const element = '[data-test="event-name-filter"]'
    const eventNameQuery = 'Big Event'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      name: eventNameQuery,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ name: eventNameQuery })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('have.value', eventNameQuery)
      assertChipExists({ label: eventNameQuery, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${eventNameQuery}{enter}`)
      assertPayload('@apiRequest', expectedPayload)

      assertQueryParams('name', eventNameQuery)
      assertChipExists({ label: eventNameQuery, position: 1 })
      removeChip(eventNameQuery)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const brazilCountryId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      country: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        country: [brazilCountryId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Country',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('country', [brazilCountryId])
      assertChipExists({ label: 'Brazil', position: 1 })
      removeChip(brazilCountryId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('UK Region', () => {
    const element = '[data-test="uk-region-filter"]'
    const southEastRegionId = '884cd12a-6095-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      uk_region: [southEastRegionId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        uk_region: [southEastRegionId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'South East')
      assertChipExists({ label: 'South East', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'UK region',
        placeholder: 'Search UK region',
        input: 'South E',
        expectedOption: 'South East',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('uk_region', [southEastRegionId])
      assertChipExists({ label: 'South East', position: 1 })
      removeChip(southEastRegionId)
      cy.wait('@apiRequest')
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Organiser', () => {
    const element = '[data-test="organiser-filter"]'
    const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
    const adviserName = 'Puck Head'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      organiser: [adviserId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ organiser: [adviserId] })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', adviserName)
      assertChipExists({ label: adviserName, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstAdvisersTypeaheadOption({ element, input: adviserName })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('organiser', [adviserId])
      assertChipExists({
        label: `Organiser: ${adviserName}`,
        position: 1,
      })
      removeChip(adviserId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Event Type', () => {
    const element = '[data-test="event-type-filter"] fieldset'
    const eventType = randomChoice(eventTypes)

    it('should filter from the url', () => {
      const queryString = buildQueryString({ event_type: [eventType.id] })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
        'eventTypeApiRequest'
      )
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@eventTypeApiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        event_type: [eventType.id],
      })
      assertCheckboxGroupOption({ element, value: eventType.id })
      assertChipExists({ label: eventType.name, position: 1 })
    })

    it('should filter from user input and remove the chip', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
        'eventTypeApiRequest'
      )
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@eventTypeApiRequest')
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({ element, value: eventType.id })
      assertPayload('@apiRequest', {
        ...minimumPayload,
        event_type: [eventType.id],
      })
      assertQueryParams('event_type', [eventType.id])
      assertChipExists({ label: eventType.name, position: 1 })

      removeChip(eventType.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertCheckboxGroupOption({
        element,
        value: eventType.id,
        checked: false,
      })
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const ukCountryId = '80756b9a-5d95-e211-a939-e4115bead28a'
      const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
      const southEastRegionId = '884cd12a-6095-e211-a939-e4115bead28a'
      const eventType = randomChoice(eventTypes)
      const queryString = qs.stringify({
        page: 1,
        name: 'Big Event',
        country: [ukCountryId],
        uk_region: [southEastRegionId],
        organiser: [adviserId],
        event_type: [eventType.id],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
        'eventTypeApiRequest'
      )
      cy.visit(`${urls.events.react.index()}?${queryString}`)
      cy.wait('@eventTypeApiRequest')
      cy.wait('@apiRequest')
    })

    it('should remove all filters and chips', () => {
      cy.get('[data-test=filter-chips]').children().as('filterChips')
      cy.get('@filterChips').should('have.length', 5)
      cy.get('[data-test=clear-filters]').click()
      cy.get('@filterChips').should('have.length', 0)
      cy.get('[data-test="event-name-filter"]').should('have.value', '')
      cy.get('[data-test="country-filter"]').should('contain', 'Search country')
      cy.get('[data-test="uk-region-filter"]').should(
        'contain',
        'Search UK region'
      )
      cy.get('[data-test="organiser-filter"]').should(
        'contain',
        'Search organiser'
      )
      assertCheckboxGroupNoneSelected('[data-test="event-type-filter"]')
    })
  })
})
