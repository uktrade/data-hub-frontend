import urls from '../../../../../src/lib/urls'
import qs from 'qs'

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

const activeStatusFlag = 'false'
const inactiveStatusFlag = 'true'
const companySearchEndpoint = '/api-proxy/v4/search/company'

describe('Companies Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')

      cy.visit(urls.companies.react.index())

      // Initial call to the api does not yet include default params
      // we shouldn't be making this call
      cy.wait('@apiRequest')

      // Second call to the api with default params
      assertPayload('@apiRequest', {
        ...minimumPayload,
        archived: false,
      })

      cy.get('[data-test="company-status-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')
    })
  })

  context('Headquarter Type', () => {
    const element = '[data-test="headquarter-type-filter"]'
    const globalHqId = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      archived: false,
      headquarter_type: [globalHqId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ headquarter_type: [globalHqId] })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: globalHqId,
        checked: true,
      })
      assertChipExists({ label: 'Global HQ', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: globalHqId,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('headquarter_type[0]', globalHqId)
      assertChipExists({ label: 'Global HQ', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(globalHqId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Company Name', () => {
    const element = '[data-test="company-name-filter"]'
    const companyNameQuery = 'Tesco'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      archived: false,
      name: companyNameQuery,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ name: companyNameQuery })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('have.value', companyNameQuery)
      assertChipExists({ label: companyNameQuery, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${companyNameQuery}{enter}`)
      assertPayload('@apiRequest', expectedPayload)

      assertQueryParams('name', companyNameQuery)
      assertChipExists({ label: companyNameQuery, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(companyNameQuery)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceSectorId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      archived: false,
      sector_descends: [aerospaceSectorId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sector_descends: [aerospaceSectorId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Sector',
        placeholder: 'Search sector',
        input: 'aero',
        expectedOption: 'Aerospace',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('sector_descends', [aerospaceSectorId])
      assertChipExists({ label: 'Aerospace', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(aerospaceSectorId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
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
      archived: false,
      sortby: 'modified_on:desc',
      country: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        country: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
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
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(brazilCountryId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
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
      archived: false,
      sortby: 'modified_on:desc',
      uk_region: [southEastRegionId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        uk_region: [southEastRegionId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'South East')
      assertChipExists({ label: 'South East', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
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
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(southEastRegionId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Status', () => {
    const element = '[data-test="company-status-filter"]'

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        archived: [activeStatusFlag],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          ...minimumPayload,
          archived: false,
        })
      })
      assertCheckboxGroupOption({
        element,
        value: 'false',
        checked: true,
      })
      assertChipExists({ label: 'Active', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).as('filter').find('label').as('options')
      cy.get('@options')
        .should('have.length', 2)
        .eq(0)
        .should('contain', 'Active')
        .find('input')
        .as('active')
        .should('be.checked')
      cy.get('@options')
        .eq(1)
        .should('contain', 'Inactive')
        .find('input')
        .as('inactive')
        .should('not.be.checked')
      assertQueryParams('archived', ['false'])
      assertChipExists({ label: 'Active', position: 1 })

      // Uncheck all
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)

      // Check inactive only
      cy.get('@inactive').check()
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          ...minimumPayload,
          archived: true,
        })
      })
      assertChipExists({ label: 'Inactive', position: 1 })

      // Check active and inactive
      cy.get('@active').check()
      assertPayload('@apiRequest', minimumPayload)
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Inactive', position: 2 })

      // Remove chips
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(inactiveStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
    })
  })

  context('Currently Exporting To Country', () => {
    const element = '[data-test="currently-exporting-to-country-filter"]'
    const brazilCountryId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      sortby: 'modified_on:desc',
      export_to_countries: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        export_to_countries: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 2 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Currently exporting to',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('export_to_countries', [brazilCountryId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 2 })
      removeChip(brazilCountryId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Future countries of interest', () => {
    const element = '[data-test="future-countries-of-interest-filter"]'
    const brazilCountryId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      sortby: 'modified_on:desc',
      future_interest_countries: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        future_interest_countries: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 2 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Future countries of interest',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('future_interest_countries', [brazilCountryId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 2 })
      removeChip(brazilCountryId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Lead ITA or Global Account Manager', () => {
    const element = '[data-test="lead-ita-global-account-manager-filter"]'
    const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
    const adviserName = 'Puck Head'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      sortby: 'modified_on:desc',
      one_list_group_global_account_manager: [adviserId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        one_list_group_global_account_manager: [adviserId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', adviserName)
      assertChipExists({ label: adviserName, position: 2 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstAdvisersTypeaheadOption({ element, input: adviserName })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('one_list_group_global_account_manager', [adviserId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({
        label: `Lead ITA or Global Account Manager: ${adviserName}`,
        position: 2,
      })
      removeChip(adviserId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const globalHqTypeId = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
      const ukCountryId = '80756b9a-5d95-e211-a939-e4115bead28a'
      const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
      const southEastRegionId = '884cd12a-6095-e211-a939-e4115bead28a'
      const advancedEngineeringSectorId = 'af959812-6095-e211-a939-e4115bead28a'
      const queryString = qs.stringify({
        page: 1,
        headquarter_type: globalHqTypeId,
        name: 'Tesco',
        sector_descends: advancedEngineeringSectorId,
        uk_postcode: 'AB1 2CD, EF3 4GH',
        uk_region: southEastRegionId,
        archived: [inactiveStatusFlag],
        country: [ukCountryId],
        export_to_countries: [ukCountryId],
        future_interest_countries: [ukCountryId],
        one_list_group_global_account_manager: [adviserId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`${urls.companies.react.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test=filter-chips]').children().as('filterChips')
    })

    it('should remove all filters and chips', () => {
      cy.get('@filterChips').should('have.length', 10)
      cy.get('[data-test=clear-filters]').click()
      cy.get('@filterChips').should('have.length', 0)
      assertCheckboxGroupNoneSelected('[data-test="headquarter-type-filter"]')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]').should('contain', 'Search sector')
      cy.get('[data-test="country-filter"]').should('contain', 'Search country')
      cy.get('[data-test="uk-postcode-filter"]').should('have.value', '')
      cy.get('[data-test="uk-region-filter"]').should(
        'contain',
        'Search UK region'
      )
      assertCheckboxGroupNoneSelected('[data-test="company-status-filter"]')
      cy.get('[data-test="currently-exporting-to-country-filter"]').should(
        'contain',
        'Search country'
      )
      cy.get('[data-test="future-countries-of-interest-filter"]').should(
        'contain',
        'Search country'
      )
      cy.get('[data-test="lead-ita-global-account-manager-filter"]').should(
        'contain',
        'Search adviser'
      )
    })
  })
})
