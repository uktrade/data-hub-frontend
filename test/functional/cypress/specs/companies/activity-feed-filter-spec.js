import qs from 'qs'

import {
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertTypeaheadOptionSelected,
  assertDateInput,
  assertPayload,
} from '../../support/assertions'

import { inputDateValue, removeChip } from '../../support/actions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'
const adviserSearchEndpoint = '/api-proxy/v4/search/adviser'

const advisersFilter = '[data-test="adviser-filter"]'
const relatedCompaniesFilter =
  '[data-test="checkbox-include_related_companies"]'

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

const minimumRequest = {
  limit: 10,
  offset: 0,
  include_parent_companies: false,
  include_subsidiary_companies: false,
  company: fixtures.company.allActivitiesCompany.id,
  sortby: 'date:desc',
}

describe('Company Activity Feed Filter', () => {
  const companyActivitiesEndPoint = '/api-proxy/v4/search/company-activity'

  context('Default Params', () => {
    beforeEach(() => {
      cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
      cy.visit(
        urls.companies.activity.index(fixtures.company.allActivitiesCompany.id)
      )
    })
    it('should set the default params in the get request url', () => {
      assertPayload('@apiRequest', minimumRequest)
    })
  })

  context('Filters', () => {
    context('Adviser Filter', () => {
      it('should pass the selected adviser as a filter in the request payload', () => {
        const queryString = buildQueryString({
          dit_participants__adviser: [adviser.id],
        })
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
        cy.intercept('POST', adviserSearchEndpoint, {
          results: [adviser],
        }).as('adviserSearchApiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )
        cy.wait('@adviserSearchApiRequest')

        assertPayload('@apiRequest', {
          limit: 10,
          offset: 0,
          dit_participants__adviser: [adviser.id],
          company: fixtures.company.allActivitiesCompany.id,
          include_parent_companies: false,
          include_subsidiary_companies: false,
          sortby: 'date:desc',
        })

        assertTypeaheadOptionSelected({
          element: advisersFilter,
          expectedOption: adviser.name,
        })
      })
    })

    context('Subject Filter', () => {
      it('should pass the interaction subject search term as a filter in the request payload', () => {
        const queryString = buildQueryString({
          subject: 'amazing',
        })
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )

        assertPayload('@apiRequest', {
          limit: 10,
          offset: 0,
          subject: 'amazing',
          company: fixtures.company.allActivitiesCompany.id,
          include_parent_companies: false,
          include_subsidiary_companies: false,
          sortby: 'date:desc',
        })
      })
    })

    context('Dates', () => {
      const dateAfterFilter = '[data-test="date-after-filter"]'
      const dateBeforeFilter = '[data-test="date-before-filter"]'
      const dateAfter = '2021-06-24'
      const dateBefore = '2023-06-24'
      const request = {
        limit: 10,
        offset: 0,
        company: fixtures.company.allActivitiesCompany.id,
        date_after: dateAfter,
        date_before: dateBefore,
        include_parent_companies: false,
        include_subsidiary_companies: false,
        sortby: 'date:desc',
      }
      it('should filter from the url', () => {
        const queryString = buildQueryString({
          date_after: dateAfter,
          date_before: dateBefore,
        })
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.allActivitiesCompany.id
          )}?${queryString}`
        )

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
        assertPayload('@apiRequest', request)
      })

      it('should filter from user input and remove chips', () => {
        const queryString = buildQueryString()
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
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

        assertChipExists({ label: 'From: 24 June 2021', position: 1 })
        assertChipExists({ label: 'To: 24 June 2023', position: 2 })
        removeChip('2021-06-24')
        const requestWithNoDateAfter = {
          limit: 10,
          offset: 0,
          company: fixtures.company.allActivitiesCompany.id,
          date_before: dateBefore,
          include_parent_companies: false,
          include_subsidiary_companies: false,
          sortby: 'date:desc',
        }
        cy.wait('@apiRequest')
        assertPayload('@apiRequest', requestWithNoDateAfter)
        removeChip('2023-06-24')
        assertPayload('@apiRequest', minimumRequest)
        assertChipsEmpty()
        assertFieldEmpty(dateBeforeFilter)
        assertFieldEmpty(dateAfterFilter)
      })
    })

    context('Include related companies filter', () => {
      const urlQuery = `?size=10&from=0&sortby=date:desc&include_related_companies[0]=include_parent_companies&include_related_companies[1]=include_subsidiary_companies`

      it('Should render the subsidiary companies option disabled when related companies large', () => {
        cy.intercept(
          'GET',
          `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
            fixtures.company.dnbGlobalUltimate.id
          )}?include_manually_linked_companies=true`,
          { reduced_tree: true, related_companies_count: 2000, total: 2000 }
        ).as('relatedCompaniesApiRequest')
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )

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
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
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
        cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )
        assertPayload('@apiRequest', {
          ...minimumRequest,
          company: fixtures.company.dnbGlobalUltimate.id,
        })
        cy.get(relatedCompaniesFilter).click({
          multiple: true,
        })
        cy.wait('@apiRequest')
        assertPayload('@apiRequest', {
          ...minimumRequest,
          company: fixtures.company.dnbGlobalUltimate.id,
          include_parent_companies: true,
          include_subsidiary_companies: true,
        })
      })

      it('should show expected options', () => {
        cy.visit(
          `${urls.companies.activity.index(
            fixtures.company.dnbGlobalUltimate.id
          )}${urlQuery}`
        )
        cy.get('[data-test="include-related-companies-filter"]').should(
          'be.visible'
        )
        cy.get('[data-test="toggle-section-button"]')
          .contains('Related companies')
          .click()
        cy.get('[data-test="include-related-companies-filter"]').should(
          'not.be.visible'
        )

        it('should filter from the url', () => {
          cy.intercept('POST', companyActivitiesEndPoint).as('apiRequest')
          cy.visit(
            `${urls.companies.activity.index(
              fixtures.company.dnbGlobalUltimate.id
            )}${urlQuery}`
          )
          assertPayload('@apiRequest', {
            limit: 10,
            offset: 0,
            company: fixtures.company.dnbGlobalUltimate.id,
            sortby: 'date:desc',
            include_parent_companies: true,
            include_subsidiary_companies: true,
          })
          assertChipExists({
            label: 'Parent companies',
            position: 1,
          })
          assertChipExists({
            label: 'Subsidiary companies',
            position: 2,
          })
        })
      })
    })
  })
})
