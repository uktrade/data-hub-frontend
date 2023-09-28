import qs from 'qs'

import { randomChoice } from '../../fakers/utils'
import { eventTypeFaker, eventTypeListFaker } from '../../fakers/event-types'
import { events } from '../../../../../src/lib/urls'
import { testTypeahead, testCheckBoxGroup } from '../../support/tests'

const searchEndpoint = '/api-proxy/v3/search/event'
const eventTypeEndpoint = '/api-proxy/v4/metadata/event-type'

const disabledEventType = eventTypeFaker({ disabled_on: '2020-01-01' })
const eventTypes = [disabledEventType, ...eventTypeListFaker(2)]
describe('events Collections Filter', () => {
  context('with the events activity stream feature flag enabled', () => {
    before(() => {
      cy.visit(events.index())
    })

    context('Event name', () => {
      const element = '[data-test="event-name-filter"]'
      const eventName = 'Big Event'
      const queryParamWithName = qs.stringify({ name: 'Big Event' })

      context('should filter from user input', () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&name=Big+Event&page=1`
          ).as('nameRequest')
        })

        it('should pass the name to the controller', () => {
          cy.get(element).type(`${eventName}{enter}`)
          cy.wait('@nameRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('should add name from user input to query param', () => {
          cy.url().should('include', queryParamWithName)
        })

        it('should not add anything to the query param if the name is backspaced', () => {
          cy.get(element).type(`{selectAll}{backspace}{enter}`)
          cy.url().should('not.include', queryParamWithName)
        })
      })

      context('should filter from url', () => {
        it('should add name from url to filter', () => {
          cy.visit(
            `/events?page=1&sortby=modified_on%3Adesc&${queryParamWithName}`
          )
          cy.get(element).should('have.value', eventName)
        })
      })

      after(() => {
        cy.get(element).clear()
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
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&earliestStartDate=2020-11-01&latestStartDate=2020-11-10&page=1`
          ).as('dateRequest')
        })
        beforeEach(() => {
          cy.get('[data-test="toggle-section-button"]')
            .contains('Dates')
            .click({ force: true })
          cy.get(earliestStartElement).clear()
          cy.get(latestStartElement).clear()
        })

        it('should pass the date to the controller', () => {
          cy.get(earliestStartElement).type(earliestStartDate)
          cy.get(latestStartElement).type(latestStartDate)
          cy.wait('@dateRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
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
          cy.get('[data-test="toggle-section-button"]')
            .contains('Dates')
            .click()
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

      context('should filter from user input', () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&aventriId=200300400&page=1`
          ).as('aventriIdRequest')
        })

        it('should pass the aventri Id to the controller', () => {
          cy.get('[data-test="toggle-section-button"]')
            .contains('Aventri')
            .click()
          cy.get(element).type(`${aventriId}{enter}`)
          cy.wait('@aventriIdRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
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

      after(() => {
        cy.get('[data-test="toggle-section-button"]')
          .contains('Aventri')
          .click()
        cy.get(element).clear()
      })
    })

    context('Country', () => {
      const element = '[data-test="country-filter"]'
      const queryParamWithCountry = 'address_country%5B0%5D=Brazil'
      const countryName = 'Brazil'

      context('should filter from user input and apply filter chips', () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&page=1&addressCountry[]=${countryName}`
          ).as('countryRequest')
        })

        it('should pass the country to the controller', () => {
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

          cy.wait('@countryRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('should pass the country from user input to query param', () => {
          cy.url().should('include', queryParamWithCountry)
        })

        it('should show filter chips', () => {
          cy.get('[data-test="typeahead-chip"]').should('contain', countryName)
        })
      })

      context('should remove country selection', () => {
        it('should remove filter chips', () => {
          cy.get('[data-test="typeahead-chip"] > button').click()
        })

        it('should remove the country from the url', () => {
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

      context('should filter from user input and apply filter chips', () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&ukRegion[]=${ukRegion}&page=1`
          ).as('ukRegionRequest')
        })
        it('should pass the uk Region to the controller', () => {
          testTypeahead({
            element,
            label: 'UK region',
            input: 'all',
            placeholder: 'Search UK region',
            expectedOption: ukRegionLabel,
          })
          cy.wait('@ukRegionRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('should pass the Uk region from user input to query param', () => {
          cy.url().should('include', queryParamWithUkRegion)
        })

        it('should show filter chips', () => {
          cy.get('[data-test="typeahead-chip"]').should(
            'contain',
            ukRegionLabel
          )
        })

        context('should remove Uk Region selection', () => {
          it('should remove filter chips', () => {
            cy.get('[data-test="typeahead-chip"] > button').click()
          })

          it('should remove the Uk Region from the url', () => {
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

      context('should filter from user input and apply filter chips', () => {
        before(() => {
          cy.intercept('POST', searchEndpoint).as('apiRequest')
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&organiser[]=${adviserId}&page=1`
          ).as('organiserRequest')
          cy.get('[data-test="toggle-section-button"]')
            .contains('Organiser')
            .click()
        })

        it('should pass the organiser to the controller', () => {
          testTypeahead({
            element,
            label: 'Organiser',
            input: 'puc',
            placeholder: '',
            expectedOption: adviserName,
          })

          cy.wait('@organiserRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('should pass the organiser from user input to query param', () => {
          cy.url().should('include', queryParamWithAdvisor)
        })

        it('should show filter chips', () => {
          cy.get('[data-test="typeahead-chip"]').should('contain', adviserName)
        })
      })

      context('should remove organiser selection', () => {
        it('should remove filter chips', () => {
          cy.get('[data-test="typeahead-chip"] > button').click()
        })

        it('should remove the organiser from the url', () => {
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
        before(() => {
          cy.intercept('GET', eventTypeEndpoint, eventTypes).as(
            'eventTypeApiRequest'
          )
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&page=1&eventType[]=${
              eventType.id
            }`
          ).as('eventTypeRequest')
        })

        it('should pass the event type to the controller', () => {
          cy.visit(events.index())
          cy.get('[data-test="toggle-section-button"]')
            .contains('Type of event')
            .click()
          testCheckBoxGroup({ element, value: eventType.id })

          cy.wait('@eventTypeRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
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
})
