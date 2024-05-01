import qs from 'qs'

import { randomChoice } from '../../fakers/utils'
import { eventTypeFaker, eventTypeListFaker } from '../../fakers/event-types'
import { events } from '../../../../../src/lib/urls'
import {
  testTypeahead,
  testTypeaheadOptionsLength,
  testCheckBoxGroup,
} from '../../support/tests'
import { ukRegionListFaker } from '../../fakers/regions'

import { assertQueryParams } from '../../support/assertions'

const searchEndpoint = '/api-proxy/v3/search/event'
const eventTypeEndpoint = '/api-proxy/v4/metadata/event-type*'
const ukRegionsEndpoint = '/api-proxy/v4/metadata/uk-region*'

const disabledEventType = eventTypeFaker({ disabled_on: '2020-01-01' })
const eventTypes = [disabledEventType, ...eventTypeListFaker(2)]

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby: 'modified_on:desc',
    page: 1,
    ...queryParams,
  })

describe('Events collection filter', () => {
  context('Event name', () => {
    const element = '[data-test="event-name-filter"]'
    const eventName = 'Big Event'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&name=Big+Event&page=1`
      ).as('nameRequest')
    })

    it('should filter from url', () => {
      const queryString = buildQueryString({ name: 'Big Event' })
      cy.visit(`/events?${queryString}`)
      cy.wait('@nameRequest')
      cy.get(element).should('have.value', eventName)
    })

    it('should filter from user input', () => {
      const queryString = buildQueryString()
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&page=1`
      ).as('apiRequest')
      cy.visit(`/events?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${eventName}{enter}`)
      cy.wait('@nameRequest')
      assertQueryParams('name', eventName)
    })
  })

  context('Start date', () => {
    const earliestStartElement = '[data-test="field-earliest_start_date"]'
    const latestStartElement = '[data-test="field-latest_start_date"]'
    const earliestStartDate = '2020-11-01'
    const latestStartDate = '2020-11-10'
    const queryParamWithEarliestStartDate = 'earliest_start_date=2020-11-01'
    const queryParamWithLatestStartDate = 'latest_start_date=2020-11-10'

    context('should filter from user input', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `${events.activity.data()}?sortBy=modified_on:desc&earliestStartDate=2020-11-01&latestStartDate=2020-11-10&page=1`
        ).as('dateRequest')
        cy.visit(events.index())
        cy.get('[data-test="toggle-section-button"]').contains('Dates').click()
      })

      it('should pass the date to the controller', () => {
        cy.get(earliestStartElement).type(earliestStartDate)
        cy.get(latestStartElement).type(latestStartDate)
      })

      it('should add earliest start date to query param', () => {
        cy.get(earliestStartElement).type(earliestStartDate)
        cy.url().should('include', queryParamWithEarliestStartDate)
        cy.url().should('not.include', queryParamWithLatestStartDate)
      })

      it('should add latest start date to query param', () => {
        cy.get(latestStartElement).type(latestStartDate)
        cy.url().should('not.include', queryParamWithEarliestStartDate)
        cy.url().should('include', queryParamWithLatestStartDate)
      })

      it('should add earliest start date and latest start date to query param', () => {
        cy.get(earliestStartElement).type(earliestStartDate)
        cy.get(latestStartElement).type(latestStartDate)
        cy.url().should('include', queryParamWithEarliestStartDate)
        cy.url().should('include', queryParamWithLatestStartDate)
      })

      it('should remove query params if date is cleared', () => {
        cy.url().should('not.include', queryParamWithEarliestStartDate)
        cy.url().should('not.include', queryParamWithLatestStartDate)
      })

      afterEach(() => {
        cy.get('[data-test="toggle-section-button"]').contains('Dates').click()
      })
    })

    context('should filter from url', () => {
      it('should add the earliest and latest start date to the url', () => {
        cy.visit(
          `/events?page=1&sortby=modified_on%3Adesc&${queryParamWithEarliestStartDate}&${queryParamWithLatestStartDate}`
        )
        cy.get(earliestStartElement).should('have.value', earliestStartDate)
        cy.get(latestStartElement).should('have.value', latestStartDate)
      })
    })
    after(() => {
      cy.get('[data-test="toggle-section-button"]').contains('Dates').click()
      cy.get(earliestStartElement).clear()
      cy.get(latestStartElement).clear()
    })
  })

  context('Aventri ID', () => {
    const element = '[data-test="aventri-id-filter"]'
    const aventriId = '200300400'
    const invalidAventriId = 'Testing %'
    const invalidAventriIdNumbers = '200300400500600'
    const queryParamWithAventriId = 'aventri_id=200300400'
    const queryParamWithInvalidAventriId = 'aventri_id=Testing %'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&aventriId=200300400&page=1`
      ).as('aventriIdRequest')
      cy.visit(events.index())
      cy.get('[data-test="toggle-section-button"]').contains('Aventri').click()
    })

    context('should filter from user input', () => {
      it('should pass the aventri Id to the controller', () => {
        cy.get(element).type(`${aventriId}{enter}`)
      })

      it('should add an aventri ID from user input to query param', () => {
        cy.get(element).type(`${aventriId}{enter}`)
        cy.url().should('include', queryParamWithAventriId)
      })
    })

    context('should apply validation', () => {
      it('should not add anything to the query param if the name is backspaced', () => {
        cy.get(element).type(`{selectAll}{backspace}{enter}`)
        cy.url().should('not.include', queryParamWithAventriId)
      })

      it('should not allow non numerical characters', () => {
        cy.get(element).type(`${invalidAventriId}{enter}`).should('be.empty')
        cy.url().should('not.include', queryParamWithInvalidAventriId)
      })

      it('should truncate any long numbers to 9 digits', () => {
        cy.get(element)
          .type(`${invalidAventriIdNumbers}{enter}`)
          .should('have.value', 200300400)
      })
    })

    context('should filter from url', () => {
      it('should add aventri id from url to filter', () => {
        cy.visit(
          `events?page=1&sortby=modified_on%3Adesc&${queryParamWithAventriId}`
        )
        cy.get(element).should('have.value', aventriId)
      })
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const queryParamWithCountry = 'address_country%5B0%5D=Brazil'
    const countryName = 'Brazil'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&page=1&addressCountry[]=${countryName}`
      ).as('countryRequest')
      cy.visit(events.index())
      cy.get('[data-test="toggle-section-button"]')
        .contains('Location')
        .click({ force: true })

      testTypeahead({
        element,
        label: 'Country',
        input: 'braz',
        placeholder: 'Search country',
        expectedOption: 'Brazil',
      })
    })

    context('should filter from user input and apply filter chips', () => {
      it('should pass the country from user input to query param', () => {
        cy.url().should('include', queryParamWithCountry)
      })

      it('should show filter chips', () => {
        cy.get('[data-test="typeahead-chip"]').should('contain', countryName)
      })
    })

    context('should remove country selection', () => {
      it('should remove filter chips and remove the country from the url', () => {
        cy.get('[data-test="typeahead-chip"] > button').click()
        cy.url().should('not.include', queryParamWithCountry)
      })
    })
  })

  context('UkRegion', () => {
    const element = '[data-test="uk-region-filter"]'
    const queryParamWithUkRegion =
      'uk_region%5B0%5D=1718e330-6095-e211-a939-e4115bead28a'
    const ukRegion = '1718e330-6095-e211-a939-e4115bead28a'
    const ukRegionLabel = 'All'

    it('should display all UK regions (active & disabled) in the filter list', () => {
      const ukRegions = [
        ...ukRegionListFaker(2),
        ...ukRegionListFaker(2, { disabled_on: '2018-01-01' }),
      ]
      const queryString = buildQueryString({ archived: ['false'] })
      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.visit(`/events?${queryString}`)
      cy.wait('@ukRegionsApiRequest')
      cy.get('[data-test="toggle-section-button"]').contains('Location').click()
      testTypeaheadOptionsLength({ element, length: ukRegions.length })
    })

    beforeEach(() => {
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&ukRegion[]=${ukRegion}&page=1`
      ).as('ukRegionRequest')
      cy.visit(events.index())
      cy.get('[data-test="toggle-section-button"]')
        .contains('Location')
        .click({ force: true })
      testTypeahead({
        element,
        label: 'UK region',
        input: 'all',
        placeholder: 'Search UK region',
        expectedOption: ukRegionLabel,
      })
    })

    context('should filter from user input and apply filter chips', () => {
      it('should pass the Uk region from user input to query param', () => {
        cy.url().should('include', queryParamWithUkRegion)
      })

      it('should show filter chips', () => {
        cy.get('[data-test="typeahead-chip"]').should('contain', ukRegionLabel)
      })

      context('should remove Uk Region selection and from the url', () => {
        it('should remove filter chips', () => {
          cy.get('[data-test="typeahead-chip"] > button').click()
          cy.url().should('not.include', queryParamWithUkRegion)
        })
      })
    })
  })

  context('Organiser', () => {
    const element = '[data-test="organiser-filter"]'
    const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
    const queryParamWithAdvisor = `organiser%5B0%5D=${adviserId}`
    const adviserName = 'Puck Head'

    beforeEach(() => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&organiser[]=${adviserId}&page=1`
      ).as('organiserRequest')
      cy.visit(events.index())
      cy.get('[data-test="toggle-section-button"]')
        .contains('Organiser')
        .click()
      testTypeahead({
        element,
        label: 'Organiser',
        input: 'puc',
        placeholder: '',
        expectedOption: adviserName,
      })
    })

    context('should filter from user input and apply filter chips', () => {
      it('should pass the organiser from user input to query param', () => {
        cy.url().should('include', queryParamWithAdvisor)
      })

      it('should show filter chips', () => {
        cy.get('[data-test="typeahead-chip"]').should('contain', adviserName)
      })
    })

    context('should remove organiser selection', () => {
      it('should remove filter chips and remove the organiser from the url', () => {
        cy.get('[data-test="typeahead-chip"] > button').click()
        cy.url().should('not.include', queryParamWithAdvisor)
      })
    })
  })

  context('Event type', () => {
    const element = '[data-test="event-type-filter"] fieldset'
    const selectedCountElement = `${element} span`
    const eventType = randomChoice(eventTypes)
    const queryParamWithEventType = `event_type%5B0%5D=${eventType.id}`

    context('should filter from user input and apply filter chips', () => {
      beforeEach(() => {
        cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
          'eventTypeApiRequest'
        )
        cy.intercept(
          'GET',
          `${events.activity.data()}?sortBy=modified_on:desc&page=1&eventType[]=${
            eventType.id
          }`
        ).as('eventTypeRequest')
        cy.visit(events.index())
        cy.get('[data-test="toggle-section-button"]')
          .contains('Type of event')
          .click()
        testCheckBoxGroup({ element, value: eventType.id })
      })

      it('should pass the event type from user input to query param', () => {
        cy.url().should('include', queryParamWithEventType)
      })

      it('should show correct number of selected items', () => {
        expect(cy.get(selectedCountElement).should('contain', '1'))
      })

      it('should remove the selected event type', () => {
        testCheckBoxGroup({ element, value: eventType.id, checked: false })
      })
    })
  })
})
