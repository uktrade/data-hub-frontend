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
const adviserSearchEndpoint = '/api-proxy/v4/search/adviser'

const advisersFilter = '[data-test="adviser-filter"]'
const myInteractionsFilter = '[data-test="my-interactions-filter"]'
const createdByOthersFilter = '[data-test="created-by-others-filter"]'
const relatedCompaniesFilter =
  '[data-test="checkbox-include_related_companies"]'

const sortByDropDown = '[data-test="sortby"]'

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
      const expectedRequestAdviserUrl = `?size=10&from=0&ditParticipantsAdviser[]=${adviser.id}&sortby=date:desc`
      const expectedRequestOtherUrl = `?size=10&from=0&createdByOthers[]=${adviser.id}&sortby=date:desc`

      it('should filter Me from the url', () => {
        const queryString = buildQueryString({
          ditParticipantsAdviser: [adviser.id],
        })
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.intercept('POST', adviserSearchEndpoint, {
          results: [adviser],
        }).as('adviserSearchApiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.wait('@adviserSearchApiRequest')
        assertRequestUrl('@apiRequest', expectedRequestAdviserUrl)

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
        cy.intercept('POST', adviserSearchEndpoint, {
          results: [adviser],
        }).as('adviserSearchApiRequest')
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
        cy.wait('@adviserSearchApiRequest')
        assertRequestUrl('@apiRequest', expectedRequestAdviserUrl)

        assertQueryParams('ditParticipantsAdviser', [adviser.id])
        assertChipExists({ label: adviser.name, position: 1 })
        removeChip(adviser.id)
        assertRequestUrl('@apiRequest', minimumRequest)
        assertChipsEmpty()
        assertFieldEmpty(myInteractionsFilter)
      })

      it('should filter Other from the url', () => {
        const queryString = buildQueryString({
          createdByOthers: [adviser.id],
        })
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        assertRequestUrl('@apiRequest', expectedRequestOtherUrl)
        assertCheckboxGroupOption({
          element: createdByOthersFilter,
          value: adviser.id,
          checked: true,
        })
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
        clickCheckboxGroupOption({
          element: createdByOthersFilter,
          value: adviser.id,
        })

        assertRequestUrl('@apiRequest', expectedRequestOtherUrl)
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
      const urlQuery = `?size=10&from=0&sortby=date:desc&include_related_companies[0]=include_parent_companies&include_related_companies[1]=include_subsidiary_companies`
      const expectedRequestUrl = `?size=10&from=0&sortby=date:desc&include_parent_companies=true&include_subsidiary_companies=true`

      it('Should render the subsidiary companies option disabled when related companies large', () => {
        cy.intercept(
          'GET',
          `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
            fixtures.company.dnbGlobalUltimate.id
          )}?include_manually_linked_companies=true`,
          { reduced_tree: true, related_companies_count: 2000, total: 2000 }
        ).as('relatedCompaniesApiRequest')
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )
        cy.wait('@apiRequest')

        cy.get(relatedCompaniesFilter).eq(0).should('not.be.disabled')
        cy.get(relatedCompaniesFilter).eq(1).should('be.disabled')
      })

      it('Should render the subsidiary companies option enabled when related companies small', () => {
        cy.intercept(
          'GET',
          `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
            fixtures.company.dnbGlobalUltimate.id
          )}?include_manually_linked_companies=true`,
          { reduced_tree: false, related_companies_count: 1, total: 1 }
        ).as('relatedCompaniesApiRequest')
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )
        cy.wait('@apiRequest')

        cy.wait('@relatedCompaniesApiRequest')
        cy.get(relatedCompaniesFilter).eq(0).should('not.be.disabled')
        cy.get(relatedCompaniesFilter).eq(1).should('not.be.disabled')
      })

      it('Activity across all companies option should be shown for related companies', () => {
        cy.intercept(
          'GET',
          `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
            fixtures.company.dnbGlobalUltimate.id
          )}?include_manually_linked_companies=true`,
          { reduced_tree: false, related_companies_count: 1, total: 1 }
        ).as('relatedCompaniesApiRequest')
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )

        assertRequestUrl('@apiRequest', minimumRequest)

        cy.get(relatedCompaniesFilter).click({
          multiple: true,
        })
        cy.wait('@apiRequest')
        assertRequestUrl('@apiRequest', expectedRequestUrl)
      })

      it('should set filter from url', () => {
        cy.intercept(
          'GET',
          `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
            fixtures.company.dnbGlobalUltimate.id
          )}?include_manually_linked_companies=true`,
          { reduced_tree: false, related_companies_count: 1, total: 1 }
        ).as('relatedCompaniesApiRequest')
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.dnbGlobalUltimate.id
          )}${urlQuery}`
        )
        cy.wait('@relatedCompaniesApiRequest')
        assertRequestUrl('@apiRequest', expectedRequestUrl)
        cy.get(relatedCompaniesFilter).should('be.checked')
      })
    })
  })

  context('Sorting', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.allActivitiesCompany.id)
      )
    })

    context('Sorted by', () => {
      const expectedRequestUrl = `?size=10&from=0&sortby=date:desc`
      const expectedRequestUrlAsc = `?size=10&from=0&sortby=date:asc`

      it('Sort by should default to desc', () => {
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}`
        )
        cy.get(sortByDropDown)
          .find(`select`)
          .invoke('val')
          .should('equal', 'date:desc')

        assertRequestUrl('@apiRequest', expectedRequestUrl)
      })

      it('Sort by should be set to `Oldest first` from the url', () => {
        const queryString = buildQueryString({
          sortby: 'date:asc',
        })
        cy.intercept('GET', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.get(sortByDropDown)
          .find(`select`)
          .invoke('val')
          .should('equal', 'date:asc')

        assertRequestUrl('@apiRequest', expectedRequestUrlAsc)
      })
    })
  })
})
