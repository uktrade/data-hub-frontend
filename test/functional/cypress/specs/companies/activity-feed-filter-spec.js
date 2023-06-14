import qs from 'qs'
import {
  assertQueryParams,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertCheckboxGroupOption,
  assertTypeaheadOptionSelected,
  assertRequestUrl,
  assertDateInput,
} from '../../support/assertions'

import {
  clickCheckboxGroupOption,
  inputDateValue,
  removeChip,
} from '../../support/actions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'
const myAdviserEndpoint = `/api-proxy/adviser/${myAdviserId}`

const advisersFilter = '[data-test="adviser-filter"]'
const myInteractionsFilter = '[data-test="my-interactions-filter"]'
const showDnBHierarchyFilter = '[data-test="show-dnb-hierarchy-filter"]'

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
  const companyActivitiesEndPoint =
    urls.companies.activity.index(fixtures.company.allActivitiesCompany.id) +
    '/data**'

  context('Default Params', () => {
    it('should set the default params in the get request url', () => {
      cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
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

    context('Created by', () => {
      const expectedRequestUrl = `?size=10&from=0&ditParticipantsAdviser[]=${adviser.id}&sortby=date:desc`

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          ditParticipantsAdviser: [adviser.id],
        })
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
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
        current user as this is the same as selecting "Created by" > "Me".
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
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
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

        assertQueryParams('ditParticipantsAdviser', [adviser.id])
        assertChipExists({ label: adviser.name, position: 1 })
        removeChip(adviser.id)
        assertRequestUrl('@apiRequest', minimumRequest)
        assertChipsEmpty()
        assertFieldEmpty(myInteractionsFilter)
      })
    })

    context('Dates', () => {
      const dateAfterFilter = '[data-test="date-after-filter"]'
      const dateBeforeFilter = '[data-test="date-before-filter"]'
      const dateAfter = '2021-06-24'
      const dateBefore = '2023-06-24'

      const expectedRequestUrl = `?size=10&from=0&sortby=date:desc&dateBefore=${dateBefore}&dateAfter=${dateAfter}`
      it('should filter from the url', () => {
        const queryString = buildQueryString({
          dateAfter: dateAfter,
          dateBefore: dateBefore,
        })
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        assertRequestUrl('@apiRequest', expectedRequestUrl)

        assertDateInput({
          element: dateAfterFilter,
          label: 'From',
          value: '2021-06-24',
        })
        assertDateInput({
          element: dateBeforeFilter,
          label: 'To',
          value: '2023-06-24',
        })
        assertChipExists({ label: 'From: 24 June 2021', position: 1 })
        assertChipExists({ label: 'To: 24 June 2023', position: 2 })
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.wait('@apiRequest')
        assert(1)
        inputDateValue({
          element: dateAfterFilter,
          value: '2021-06-24',
        })
        inputDateValue({
          element: dateBeforeFilter,
          value: '2023-06-24',
        })
        cy.wait('@apiRequest')
        assertRequestUrl('@apiRequest', expectedRequestUrl)

        assertChipExists({ label: 'From: 24 June 2021', position: 1 })
        assertChipExists({ label: 'To: 24 June 2023', position: 2 })
        removeChip('2021-06-24')
        cy.wait('@apiRequest')
        removeChip('2023-06-24')
        assertRequestUrl('@apiRequest', minimumRequest)
        assertChipsEmpty()
        assertFieldEmpty(dateBeforeFilter)
        assertFieldEmpty(dateAfterFilter)
      })
    })

    context('Include related companies filter', () => {
      const companyActivitiesEndPoint =
        urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id) +
        '/data**'

      const expectedRequestUrl = `?size=10&from=0&showDnbHierarchy[]=true&sortby=date:desc`

      it('Activity across all companies option should be shown for related companies', () => {
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )
        assertRequestUrl('@apiRequest', minimumRequest)
        cy.get(showDnBHierarchyFilter).find(`input`).parent().click()
        assertRequestUrl('@apiRequest', expectedRequestUrl)
      })

      it('should set filter from url', () => {
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.dnbGlobalUltimate.id
          )}${expectedRequestUrl}`
        )
        assertRequestUrl('@apiRequest', expectedRequestUrl)
        cy.get(showDnBHierarchyFilter).find(`input`).should('be.checked')
      })
    })
  })
})
