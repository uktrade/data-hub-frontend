import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import { randomChoice } from '../../fakers/utils'
import { eventTypeFaker, eventTypeListFaker } from '../../fakers/event-types'
import { events } from '../../../../../src/lib/urls'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../../src/apps/companies/apps/activity-feed/constants'

import {
  clickCheckboxGroupOption,
  inputDateValue,
  removeChip,
  selectFirstAdvisersTypeaheadOption,
} from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
  assertChipsEmpty,
  assertDateInput,
  assertFieldEmpty,
  assertPayload,
  assertQueryParams,
} from '../../support/assertions'
import { testTypeahead, testTypeaheadOptionsLength } from '../../support/tests'
import { ukRegionFaker, ukRegionListFaker } from '../../fakers/regions'

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
const ukRegionsEndpoint = '/api-proxy/v4/metadata/uk-region'

describe('events Collections Filter', () => {
  context('with the events activity stream feature flag disabled', () => {
    const disabledEventType = eventTypeFaker({ disabled_on: '2020-01-01' })
    const eventTypes = [disabledEventType, ...eventTypeListFaker(2)]

    context('Default Params', () => {
      it('should set the default params', () => {
        cy.intercept('POST', searchEndpoint).as('apiRequest')

        cy.visit(urls.events.index())

        // Second call to the api with default params
        assertPayload('@apiRequest', minimumPayload)
      })
    })

    context('Toggle groups', () => {
      it('should show event details filters and hide them on toggle', () => {
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit('/events')
        cy.wait('@apiRequest')
        cy.get('[data-test="event-name-filter"]').should('be.visible')
        cy.get('[data-test="toggle-section-button"]')
          .contains('Event details')
          .click()
        cy.get('[data-test="event-name-filter"]').should('not.be.visible')
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
        cy.visit(`/events?${queryString}`)
        assertPayload('@apiRequest', expectedPayload)
        cy.get(element).should('have.value', eventNameQuery)
        assertChipExists({ label: eventNameQuery, position: 1 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
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
        address_country: [brazilCountryId],
      }

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          address_country: [brazilCountryId],
        })
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
        assertPayload('@apiRequest', expectedPayload)
        cy.get(element).should('contain', 'Brazil')
        assertChipExists({ label: 'Brazil', position: 1 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
        cy.wait('@apiRequest')

        cy.get('[data-test="toggle-section-button"]')
          .contains('Event location details')
          .click()

        testTypeahead({
          element,
          label: 'Country',
          placeholder: 'Search country',
          input: 'braz',
          expectedOption: 'Brazil',
        })
        assertPayload('@apiRequest', expectedPayload)
        assertQueryParams('address_country', [brazilCountryId])
        assertChipExists({ label: 'Brazil', position: 1 })
        removeChip(brazilCountryId)
        assertPayload('@apiRequest', minimumPayload)
        assertChipsEmpty()
        assertFieldEmpty(element)
      })
    })

    context('UK Region', () => {
      const element = '[data-test="uk-region-filter"]'
      const ukRegion = ukRegionFaker()
      const ukRegions = [
        ukRegion,
        ...ukRegionListFaker(5),
        ...ukRegionListFaker(5, { disabled_on: '2000-01-01' }),
      ]
      const expectedPayload = {
        offset: 0,
        limit: 10,
        sortby: 'modified_on:desc',
        uk_region: [ukRegion.id],
      }

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          uk_region: [ukRegion.id],
        })
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
          'ukRegionsApiRequest'
        )
        cy.visit(`/events?${queryString}`)
        cy.wait('@ukRegionsApiRequest')
        assertPayload('@apiRequest', expectedPayload)
        cy.get(element).should('contain', ukRegion.name)
        assertChipExists({ label: ukRegion.name, position: 1 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
          'ukRegionsApiRequest'
        )
        cy.visit(`/events?${queryString}`)
        cy.wait('@ukRegionsApiRequest')
        cy.wait('@apiRequest')

        cy.get('[data-test="toggle-section-button"]')
          .contains('Event location details')
          .click()
        testTypeaheadOptionsLength({ element, length: ukRegions.length })
        testTypeahead({
          element,
          label: 'UK region',
          placeholder: 'Search UK region',
          input: ukRegion.name,
          expectedOption: ukRegion.name,
        })

        assertPayload('@apiRequest', expectedPayload)
        assertQueryParams('uk_region', [ukRegion.id])
        assertChipExists({ label: ukRegion.name, position: 1 })
        removeChip(ukRegion.id)
        assertPayload('@apiRequest', minimumPayload)
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
        cy.visit(`/events?${queryString}`)
        assertPayload('@apiRequest', expectedPayload)
        cy.get(element).should('contain', adviserName)
        assertChipExists({ label: adviserName, position: 1 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
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
        cy.visit(`/events?${queryString}`)
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
        cy.visit(`/events?${queryString}`)
        cy.wait('@eventTypeApiRequest')
        cy.wait('@apiRequest')

        cy.get(element).find('label').should('have.length', eventTypes.length)
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

    context('From / To Dates', () => {
      const fromElement = '[data-test="start-date-after-filter"]'
      const fromDate = '2020-01-01'
      const formattedFromDate = '1 January 2020'
      const toElement = '[data-test="start-date-before-filter"]'
      const toDate = '2021-10-05'
      const formattedToDate = '5 October 2021'
      const expectedPayload = {
        ...minimumPayload,
        start_date_after: fromDate,
        start_date_before: toDate,
      }

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          start_date_after: fromDate,
          start_date_before: toDate,
        })
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
        assertPayload('@apiRequest', expectedPayload)
        assertChipExists({ label: `From: ${formattedFromDate}`, position: 1 })
        assertChipExists({ label: `To: ${formattedToDate}`, position: 2 })
        assertDateInput({
          element: fromElement,
          label: 'From',
          value: fromDate,
        })
        assertDateInput({
          element: toElement,
          label: 'To',
          value: toDate,
        })
      })

      it('should filter from user input and remove the chip', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`/events?${queryString}`)
        cy.wait('@apiRequest')

        inputDateValue({
          element: fromElement,
          value: fromDate,
        })
        cy.wait('@apiRequest')
        inputDateValue({
          element: toElement,
          value: toDate,
        })
        assertPayload('@apiRequest', expectedPayload)

        assertQueryParams('start_date_after', fromDate)
        assertQueryParams('start_date_before', toDate)
        assertChipExists({ label: `From: ${formattedFromDate}`, position: 1 })
        assertChipExists({ label: `To: ${formattedToDate}`, position: 2 })
        assertDateInput({
          element: fromElement,
          label: 'From',
          value: fromDate,
        })
        assertDateInput({
          element: toElement,
          label: 'To',
          value: toDate,
        })

        removeChip(fromDate)
        cy.wait('@apiRequest')
        removeChip(toDate)
        assertPayload('@apiRequest', minimumPayload)
        assertChipsEmpty()

        assertDateInput({
          element: fromElement,
          label: 'From',
          value: '',
        })
        assertDateInput({
          element: toElement,
          label: 'To',
          value: '',
        })
      })
    })

    context('Remove all filters', () => {
      before(() => {
        const ukCountryId = '80756b9a-5d95-e211-a939-e4115bead28a'
        const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
        const fromDate = '2020-01-01'
        const toDate = '2021-10-05'
        const eventType = randomChoice(eventTypes)
        const ukRegions = ukRegionListFaker(10)
        const queryString = qs.stringify({
          page: 1,
          name: 'Big Event',
          address_country: [ukCountryId],
          uk_region: [ukRegions[0].id],
          organiser: [adviserId],
          event_type: [eventType.id],
          start_date_after: fromDate,
          start_date_before: toDate,
        })
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
          'eventTypeApiRequest'
        )
        cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
          'ukRegionsApiRequest'
        )
        cy.visit(`/events?${queryString}`)
        cy.wait('@eventTypeApiRequest')
        cy.wait('@ukRegionsApiRequest')
        cy.wait('@apiRequest')
      })

      it('should remove all filters and chips', () => {
        cy.get('[data-test=clear-filters]').click()
        cy.get('[data-test=filter-chips]').children().should('have.length', 0)
        cy.get('[data-test="event-name-filter"]').should('have.value', '')
        cy.get('[data-test="country-filter"]')
          .find('[data-test="typeahead-chip"]')
          .should('have.length', 0)
        cy.get('[data-test="uk-region-filter"]')
          .find('[data-test="typeahead-chip"]')
          .should('have.length', 0)
        cy.get('[data-test="organiser-filter"]')
          .find('[data-test="typeahead-chip"]')
          .should('have.length', 0)
        assertDateInput({
          element: '[data-test="start-date-after-filter"]',
          label: 'From',
          value: '',
        })
        assertDateInput({
          element: '[data-test="start-date-before-filter"]',
          label: 'To',
          value: '',
        })
        assertCheckboxGroupNoneSelected('[data-test="event-type-filter"]')
      })
    })
  })
  context('with the events activity stream feature flag enabled', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
      cy.visit(events.index())
    })
    context('Event name', () => {
      const element = '[data-test="event-name-filter"]'
      const eventName = 'Big Event'
      const queryParamWithName = 'name=Big+Event'
      const queryParamEmpty = 'name='

      it('should not add anything to the query param when the page is first loaded', () => {
        cy.url().should('not.include', queryParamEmpty)
      })

      it('should add name from user input to query param', () => {
        cy.get(element).type(`${eventName}{enter}`)
        cy.url().should('include', queryParamWithName)
      })

      it('should not add anything to the query param if the name is backspaced', () => {
        cy.get(element).type(`${eventName}{enter}`)
        cy.get(element).type(`{selectAll}{backspace}{enter}`)
        cy.url().should('not.include', queryParamWithName)
      })
    })
    after(() => {
      cy.resetUser()
    })
  })
})
