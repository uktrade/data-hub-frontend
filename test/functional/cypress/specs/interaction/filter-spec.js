import qs from 'qs'

import { interactions } from '../../../../../src/lib/urls'

import {
  clickCheckboxGroupOption,
  removeChip,
  selectFirstMockedTypeaheadOption,
  inputDateValue,
} from '../../support/actions'

import {
  assertQueryParams,
  assertPayload,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertCheckboxGroupOption,
  assertTypeaheadOptionSelected,
  assertDateInput,
} from '../../support/assertions'

import { testTypeahead } from '../../support/tests'
import { serviceFaker } from '../../fakers/services'
import { policyAreaFaker } from '../../fakers/policy-area'
import { policyIssueTypeFaker } from '../../fakers/policy-issue-type'
import { companyOneListgroupTierFaker } from '../../fakers/company-one-list-group-tier'

const companyResult = require('../../../../sandbox/fixtures/autocomplete-company-list.json')

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby: 'date:desc',
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby: 'date:desc',
}

const interactionsSearchEndpoint = '/api-proxy/v3/search/interaction'
const adviserAutocompleteEndpoint = '/api-proxy/adviser/?autocomplete=*'
const companyAutocompleteEndpoint = '/api-proxy/v4/company?autocomplete=*'
const serviceMetadataEndpoint = '/api-proxy/v4/metadata/service'
const policyAreaMetadataEndpoint = '/api-proxy/v4/metadata/policy-area'
const policyIssueTypeMetadataEndpoint =
  '/api-proxy/v4/metadata/policy-issue-type'
const companyOneListTierGroupMetadataEndpoint =
  '/api-proxy/v4/metadata/one-list-tier'

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'
const myAdviserEndpoint = `/api-proxy/adviser/${myAdviserId}`

const advisersFilter = '[data-test="adviser-filter"]'
const myInteractionsFilter = '[data-test="my-interactions-filter"]'

const adviser = {
  id: myAdviserId,
  name: 'Barry Oling6',
}

const myCompanyId = '0fb3379c-341c-4da4-b825-bf8d47b26baa'
const myCompanyEndpoint = `/api-proxy/v4/company/${myCompanyId}`

const companiesFilter = '[data-test="company-filter"]'

const company = {
  id: myCompanyId,
  name: 'Lambda plc',
}
describe('Interactions Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(interactions.index())
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
    })
  })

  context('Toggle groups', () => {
    it('should show interaction details filters and hide them on toggle', () => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit('/interactions')
      cy.wait('@apiRequest')
      cy.get('[data-test="adviser-filter"]').should('be.visible')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Interaction details')
        .click()
      cy.get('[data-test="adviser-filter"]').should('not.be.visible')
    })
  })

  context('Interaction Kind', () => {
    const element = '[data-test="status-filter"]'

    it('should filter from the url', () => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      const queryParams = buildQueryString({
        kind: ['interaction', 'service_delivery'],
      })
      cy.visit(`/interactions?${queryParams}`)
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction', 'service_delivery'],
      })
      assertCheckboxGroupOption({
        element,
        value: 'interaction',
        checked: true,
      })
      assertCheckboxGroupOption({
        element,
        value: 'service_delivery',
        checked: true,
      })
      assertChipExists({ label: 'Interaction', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: 'interaction',
      })
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction'],
      })
      clickCheckboxGroupOption({
        element,
        value: 'service_delivery',
      })
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction', 'service_delivery'],
      })

      assertQueryParams('kind', ['interaction', 'service_delivery'])
      assertChipExists({ label: 'Interaction', position: 1 })
      assertChipExists({ label: 'Service delivery', position: 2 })
      removeChip('interaction')
      cy.wait('@apiRequest')
      removeChip('service_delivery')
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Companies', () => {
    const expectedPayload = {
      ...minimumPayload,
      company: [company.id],
    }

    it('should filter from the url', () => {
      const queryParams = buildQueryString({
        company: [company.id],
      })

      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', companyAutocompleteEndpoint, {
        count: 1,
        results: [company],
      }).as('companyListApiRequest')
      cy.intercept('GET', myCompanyEndpoint, company).as('companyApiRequest')
      cy.visit(`/interactions?${queryParams}`)
      assertPayload('@apiRequest', expectedPayload)
      assertTypeaheadOptionSelected({
        element: companiesFilter,
        expectedOption: company.name,
      })
      assertChipExists({ label: company.name, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', companyAutocompleteEndpoint, {
        count: 1,
        results: [company],
      }).as('companyListApiRequest')
      cy.intercept('GET', myCompanyEndpoint, company).as('companyApiRequest')

      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstMockedTypeaheadOption({
        element: companiesFilter,
        input: company.name,
        mockCompanyResponse: false,
        url: `/api-proxy/v4/company?*`,
        bodyResult: companyResult,
      })
      cy.wait('@companyListApiRequest')
      cy.wait('@companyApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('company', [company.id])
      assertTypeaheadOptionSelected({
        element: companiesFilter,
        expectedOption: company.name,
      })
      assertChipExists({
        label: company.name,
        position: 1,
      })

      removeChip(company.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(companiesFilter)
    })
  })

  context('Advisers', () => {
    const expectedPayload = {
      ...minimumPayload,
      dit_participants__adviser: [adviser.id],
    }

    it('should filter from the url', () => {
      const queryParams = buildQueryString({
        dit_participants__adviser: [adviser.id],
      })

      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', adviserAutocompleteEndpoint, {
        count: 1,
        results: [adviser],
      }).as('adviserListApiRequest')
      cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`/interactions?${queryParams}`)
      assertPayload('@apiRequest', expectedPayload)
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: adviser.name,
      })
      assertChipExists({ label: adviser.name, position: 1 })
      /*
       Asserts the "My interactions" filter checkbox as this should
      be checked if the adviser chosen is the same as the current user.
      */
      assertCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
        checked: true,
      })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', adviserAutocompleteEndpoint, {
        count: 1,
        results: [adviser],
      }).as('adviserListApiRequest')
      cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')

      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstMockedTypeaheadOption({
        element: advisersFilter,
        input: adviser.name,
        mockAdviserResponse: false,
      })
      cy.wait('@adviserListApiRequest')
      cy.wait('@adviserApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('dit_participants__adviser', [adviser.id])
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: adviser.name,
      })
      /*
       Asserts the "My interactions" filter checkbox as this should
      be checked if the adviser chosen is the same as the current user.
      */
      assertCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
        checked: true,
      })
      assertChipExists({
        label: adviser.name,
        position: 1,
      })

      removeChip(adviser.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(advisersFilter)
    })
  })

  context('My interactions', () => {
    const expectedPayload = {
      ...minimumPayload,
      dit_participants__adviser: [adviser.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        dit_participants__adviser: [adviser.id],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@adviserApiRequest')
      assertPayload('@apiRequest', expectedPayload)
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
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', myAdviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')
      clickCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
      })
      cy.wait('@adviserApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('adviser', [adviser.id])
      assertChipExists({ label: adviser.name, position: 1 })
      removeChip(adviser.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(myInteractionsFilter)
    })
  })

  context('Dates', () => {
    const dateAfter = '[data-test="date-after-filter"]'
    const dateBefore = '[data-test="date-before-filter"]'

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        date_after: '2021-06-24',
        date_before: '2023-06-24',
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', {
        ...minimumPayload,
        date_after: '2021-06-24',
        date_before: '2023-06-24',
      })
      assertDateInput({
        element: dateAfter,
        label: 'From',
        value: '2021-06-24',
      })
      assertDateInput({
        element: dateBefore,
        label: 'To',
        value: '2023-06-24',
      })
      assertChipExists({ label: 'From: 24 June 2021', position: 1 })
      assertChipExists({ label: 'To: 24 June 2023', position: 2 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      inputDateValue({
        element: dateAfter,
        value: '2021-06-24',
      })
      inputDateValue({
        element: dateBefore,
        value: '2023-06-24',
      })
      cy.wait('@apiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        date_after: '2021-06-24',
        date_before: '2023-06-24',
      })
      assertChipExists({ label: 'From: 24 June 2021', position: 1 })
      assertChipExists({ label: 'To: 24 June 2023', position: 2 })
      removeChip('2021-06-24')
      cy.wait('@apiRequest')
      removeChip('2023-06-24')
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(dateBefore)
      assertFieldEmpty(dateAfter)
    })
  })

  context('Service', () => {
    const element = '[data-test="service-filter"]'
    const service = serviceFaker()
    const expectedPayload = {
      ...minimumPayload,
      service: [service.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        service: [service.id],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', serviceMetadataEndpoint, [service]).as(
        'metaApiRequest'
      )
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@metaApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: service.id,
        checked: true,
      })
      assertChipExists({ label: service.name, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', serviceMetadataEndpoint, [service]).as(
        'metaApiRequest'
      )
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')
      cy.wait('@metaApiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Service details')
        .click()
      clickCheckboxGroupOption({
        element,
        value: service.id,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertChipExists({ label: service.name, position: 1 })
      removeChip(service.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      sector_descends: [aerospaceId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sector_descends: [aerospaceId],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        label: 'Sector',
        placeholder: 'Search sector',
        input: 'aero',
        expectedOption: 'Aerospace',
      })

      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('sector_descends', [aerospaceId])
      assertChipExists({ label: 'Aerospace', position: 1 })
      removeChip(aerospaceId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Business intelligence', () => {
    const element = '[data-test="business-intelligence-filter"]'
    const expectedPayload = {
      ...minimumPayload,
      was_policy_feedback_provided: true,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        was_policy_feedback_provided: ['true'],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: 'true',
        checked: true,
      })
      assertChipExists({ label: 'Includes business intelligence', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: 'true',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertChipExists({ label: 'Includes business intelligence', position: 1 })
      removeChip('true')
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
    })
  })

  context('Policy areas', () => {
    const element = '[data-test="policy-area-filter"]'
    const policyArea = policyAreaFaker()
    const expectedPayload = {
      ...minimumPayload,
      policy_areas: [policyArea.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        policy_areas: [policyArea.id],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', policyAreaMetadataEndpoint, [policyArea]).as(
        'metaApiRequest'
      )
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.wait('@metaApiRequest')
      assertCheckboxGroupOption({
        element,
        value: policyArea.id,
        checked: true,
      })
      assertChipExists({ label: policyArea.name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', policyAreaMetadataEndpoint, [policyArea]).as(
        'metaApiRequest'
      )
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')
      cy.wait('@metaApiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Policy details')
        .click()
      clickCheckboxGroupOption({
        element,
        value: policyArea.id,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('policy_areas', [policyArea.id])
      assertChipExists({ label: policyArea.name, position: 1 })
      removeChip(policyArea.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Policy issue types', () => {
    const element = '[data-test="policy-issue-type-filter"]'
    const policyIssueType = policyIssueTypeFaker()
    const expectedPayload = {
      ...minimumPayload,
      policy_issue_types: [policyIssueType.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        policy_issue_types: [policyIssueType.id],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', policyIssueTypeMetadataEndpoint, [
        policyIssueType,
      ]).as('metaApiRequest')
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.wait('@metaApiRequest')
      assertCheckboxGroupOption({
        element,
        value: policyIssueType.id,
        checked: true,
      })
      assertChipExists({ label: policyIssueType.name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', policyIssueTypeMetadataEndpoint, [
        policyIssueType,
      ]).as('metaApiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')
      cy.wait('@metaApiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Policy details')
        .click()
      clickCheckboxGroupOption({
        element,
        value: policyIssueType.id,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('policy_issue_types', [policyIssueType.id])
      assertChipExists({ label: policyIssueType.name, position: 1 })
      removeChip(policyIssueType.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Company One List group tier', () => {
    const element = '[data-test="company-one-list-group-tier-filter"]'
    const companyOneListgroupTier = companyOneListgroupTierFaker()
    const expectedPayload = {
      ...minimumPayload,
      company_one_list_group_tier: [companyOneListgroupTier.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        company_one_list_group_tier: [companyOneListgroupTier.id],
      })
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', companyOneListTierGroupMetadataEndpoint, [
        companyOneListgroupTier,
      ]).as('metaApiRequest')
      cy.visit(`/interactions?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.wait('@metaApiRequest')
      assertCheckboxGroupOption({
        element,
        value: companyOneListgroupTier.id,
        checked: true,
      })
      assertChipExists({ label: companyOneListgroupTier.name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', companyOneListTierGroupMetadataEndpoint, [
        companyOneListgroupTier,
      ]).as('metaApiRequest')
      cy.visit(`/interactions?${queryString}`)
      cy.wait('@apiRequest')
      cy.wait('@metaApiRequest')

      clickCheckboxGroupOption({
        element,
        value: companyOneListgroupTier.id,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('company_one_list_group_tier', [
        companyOneListgroupTier.id,
      ])
      assertChipExists({ label: companyOneListgroupTier.name, position: 1 })
      removeChip(companyOneListgroupTier.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })
})
