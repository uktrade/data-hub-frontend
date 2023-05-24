import qs from 'qs'
import {
  assertQueryParams,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertCheckboxGroupOption,
  assertTypeaheadOptionSelected,
  assertRequestUrl,
} from '../../support/assertions'

import { clickCheckboxGroupOption, removeChip } from '../../support/actions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'
const myAdviserEndpoint = `/api-proxy/adviser/${myAdviserId}`

const advisersFilter = '[data-test="adviser-filter"]'
const myInteractionsFilter = '[data-test="my-interactions-filter"]'

const activitiesSearchEndPoint =
  urls.companies.activity.index(fixtures.company.allActivitiesCompany.id) +
  '/data**'

const adviser = {
  id: myAdviserId,
  name: 'Jimmy West',
}

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby: 'date:desc',
    ...queryParams,
  })

const minimumRequest = '?size=10&from=0&sortby=date:desc'

describe('Company Activity Feed Filter', () => {
  context('Default Params', () => {
    it('should set the default params in the get request url', () => {
      cy.intercept('GET', activitiesSearchEndPoint).as('apiRequest')
      cy.visit(
        urls.companies.activity.index(fixtures.company.allActivitiesCompany.id)
      )
      assertRequestUrl('@apiRequest', minimumRequest)
    })
  })

  context('Filters', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.allActivitiesCompany.id)
      )
    })

    context('My interactions', () => {
      const expectedRequestUrl = `?size=10&from=0&dit_participants__adviser[]=${adviser.id}&sortby=date:desc`

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          dit_participants__adviser: [adviser.id],
        })
        cy.intercept('GET', activitiesSearchEndPoint).as('apiRequest')
        cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.wait('@adviserApiRequest')
        assertRequestUrl('@apiRequest', expectedRequestUrl)
        /*
        Asserts the "Adviser typeahead" filter is selected with the
        current user as this is the same as selecting "My interactions".
        */
        assertTypeaheadOptionSelected({
          element: advisersFilter,
          expectedOption: adviser.name,
        })
        assertCheckboxGroupOption({
          element: myInteractionsFilter,
          value: adviser.id,
          checked: true,
        })
        assertChipExists({ label: adviser.name, position: 1 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('GET', activitiesSearchEndPoint).as('apiRequest')
        cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.wait('@apiRequest')
        clickCheckboxGroupOption({
          element: myInteractionsFilter,
          value: adviser.id,
        })
        cy.wait('@adviserApiRequest')
        assertRequestUrl('@apiRequest', expectedRequestUrl)

        assertQueryParams('adviser', [adviser.id])
        assertChipExists({ label: adviser.name, position: 1 })
        removeChip(adviser.id)
        assertRequestUrl('@apiRequest', minimumRequest)
        assertChipsEmpty()
        assertFieldEmpty(myInteractionsFilter)
      })
    })
  })
})
