import qs from 'qs'

import urls from '../../../../../src/lib/urls'

import {
  clickCheckboxGroupOption,
  inputDateValue,
  removeChip,
  selectFirstMockedTypeaheadOption,
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

import {
  administrativeAreaListFaker,
  administrativeAreaFaker,
} from '../../fakers/administrative-areas'
import { ukRegionFaker, ukRegionListFaker } from '../../fakers/regions'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    archived: ['false'],
    has_name: ['true'],
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
const companyHasNameStatusFlag = 'true'
const companyHasNoNameStatusFlag = 'false'
const companySearchEndpoint = '/api-proxy/v4/search/company'
const adviserSearchEndpoint = '/api-proxy/v4/search/adviser'
const ukRegionsEndpoint = '/api-proxy/v4/metadata/uk-region*'
const usaCountryId = '81756b9a-5d95-e211-a939-e4115bead28a'
const canadaCountryId = '5daf72a6-5d95-e211-a939-e4115bead28a'
const usStatesEndpoint = `/api-proxy/v4/metadata/administrative-area?country=${usaCountryId}`
const canadianProvincesEndpoint = `/api-proxy/v4/metadata/administrative-area?country=${canadaCountryId}`

describe('Companies Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')

      cy.visit(urls.companies.index())

      cy.get('[data-test="company-status-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')

      cy.get('[data-test="company-has-name-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')
    })
  })

  context('Toggle groups', () => {
    it('should show company details filters and hide them on toggle', () => {
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit('/companies')
      cy.wait('@apiRequest')
      cy.get('[data-test="company-name-filter"]').should('be.visible')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Company details')
        .click()
      cy.get('[data-test="company-name-filter"]').should('not.be.visible')
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
      has_name: true,
      headquarter_type: [globalHqId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ headquarter_type: [globalHqId] })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
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
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: globalHqId,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('headquarter_type[0]', globalHqId)
      assertChipExists({ label: 'Global HQ', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      assertChipExists({ label: 'Company has name', position: 3 })

      removeChip(globalHqId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
      has_name: true,
      name: companyNameQuery,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ name: companyNameQuery })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('have.value', companyNameQuery)
      assertChipExists({ label: companyNameQuery, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${companyNameQuery}{enter}`)
      assertPayload('@apiRequest', expectedPayload)

      assertQueryParams('name', companyNameQuery)
      assertChipExists({ label: companyNameQuery, position: 1 })
      assertChipExists(
        { label: 'Active', position: 2 },
        { label: 'Matched', position: 3 }
      )

      removeChip(companyNameQuery)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
      has_name: true,
      sector_descends: [aerospaceSectorId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sector_descends: [aerospaceSectorId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        label: 'Sector',
        placeholder: 'Search sector',
        input: 'aero',
        expectedOption: 'Aerospace',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('sector_descends', [aerospaceSectorId])
      assertChipExists({ label: 'Aerospace', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(aerospaceSectorId)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sub-sector', () => {
    const element = '[data-test="sub-sector-filter"]'
    const aircraftDesignSubSectorId = 'af22c9d2-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      sortby: 'modified_on:desc',
      archived: false,
      has_name: true,
      sector_descends: [aircraftDesignSubSectorId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sub_sector_descends: [aircraftDesignSubSectorId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aircraft Design')
      assertChipExists({ label: 'Aerospace : Aircraft Design', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        label: 'Sub-sector',
        placeholder: 'Search sub-sector',
        input: 'air',
        expectedOption: 'Aerospace : Aircraft Design',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('sector_descends', [aircraftDesignSubSectorId])
      assertChipExists({ label: 'Aerospace : Aircraft Design', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      assertChipExists({ label: 'Company has name', position: 3 })
      removeChip(aircraftDesignSubSectorId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
      has_name: true,
      sortby: 'modified_on:desc',
      country: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        country: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
        .click()
      testTypeahead({
        element,
        label: 'Country',
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
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('US State', () => {
    const element = '[data-test="us-state-filter"]'
    const state = administrativeAreaFaker()
    const usStates = [state, ...administrativeAreaListFaker(20)]

    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      area: [state.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        us_state: [state.id],
      })
      cy.intercept('GET', usStatesEndpoint, usStates).as('usStatesApiRequest')
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@usStatesApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', state.name)
      assertChipExists({ label: `US state: ${state.name}`, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('GET', usStatesEndpoint, usStates).as('usStatesApiRequest')
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@usStatesApiRequest')
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
        .click()
      testTypeahead({
        element,
        label: 'US state',
        placeholder: 'Search US state',
        input: state.name,
        expectedOption: state.name,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('us_state', [state.id])
      assertChipExists({ label: `US state: ${state.name}`, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
      assertChipExists({ label: 'Company has name', position: 3 })
      removeChip(state.id)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Canadian Province', () => {
    const element = '[data-test="canadian-province-filter"]'
    const province = administrativeAreaFaker()
    const provinces = [province, ...administrativeAreaListFaker(10)]

    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      area: [province.id],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        canadian_province: [province.id],
      })
      cy.intercept('GET', canadianProvincesEndpoint, provinces).as(
        'canadianProvincesApiRequest'
      )
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@canadianProvincesApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', province.name)
      assertChipExists({
        label: `Canadian province: ${province.name}`,
        position: 1,
      })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('GET', canadianProvincesEndpoint, provinces).as(
        'canadianProvincesApiRequest'
      )
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@canadianProvincesApiRequest')
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
        .click()
      testTypeahead({
        element,
        label: 'Canadian province',
        placeholder: 'Search Canadian province',
        input: province.name,
        expectedOption: province.name,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('canadian_province', [province.id])
      assertChipExists({
        label: `Canadian province: ${province.name}`,
        position: 1,
      })
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(province.id)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      uk_region: [ukRegion.id],
    }

    it('should display all UK regions (active & disabled) in the filter list', () => {
      const ukRegionsIndependent = [
        ...ukRegionListFaker(2),
        ...ukRegionListFaker(2, { disabled_on: '2018-01-01' }),
      ]
      const queryString = buildQueryString()
      cy.intercept('GET', ukRegionsEndpoint, ukRegionsIndependent).as(
        'ukRegionsIndependentApiRequest'
      )
      cy.visit(`/companies?${queryString}`)
      cy.wait('@ukRegionsIndependentApiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
        .click()
      testTypeaheadOptionsLength({
        element,
        length: ukRegionsIndependent.length,
      })
    })

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        uk_region: [ukRegion.id],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')

      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.visit(`/companies?${queryString}`)
      cy.wait('@ukRegionsApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', ukRegion.name)
      assertChipExists({ label: ukRegion.name, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.visit(`/companies?${queryString}`)
      cy.wait('@ukRegionsApiRequest')
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
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
      assertChipExists({ label: 'Active', position: 2 })
      removeChip(ukRegion.id)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
        has_name: true,
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          ...minimumPayload,
          archived: false,
          has_name: true,
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
      cy.visit(`/companies?${queryString}`)
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
      removeChip(companyHasNameStatusFlag)
      cy.wait('@apiRequest')
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

  context('Company Has Name', () => {
    const element = '[data-test="company-has-name-filter"]'

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        archived: [activeStatusFlag],
        has_name: true,
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          ...minimumPayload,
          archived: false,
          has_name: true,
        })
      })
      assertCheckboxGroupOption({
        element,
        value: 'true',
        checked: true,
      })
      assertChipExists({ label: 'Company has name', position: 2 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).as('filter').find('label').as('options')
      cy.get('@options')
        .should('have.length', 2)
        .eq(0)
        .should('contain', 'True')
        .find('input')
        .as('True')
        .should('be.checked')
      cy.get('@options')
        .eq(1)
        .should('contain', 'False')
        .find('input')
        .as('False')
        .should('not.be.checked')

      assertQueryParams('has_name', ['true'])
      assertChipExists({ label: 'Company has name: True', position: 2 })

      // Uncheck all
      removeChip(companyHasNameStatusFlag)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      assertPayload('@apiRequest', minimumPayload)

      // Check inactive only
      cy.get('@False').check()
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          ...minimumPayload,
          has_name: false,
        })
      })
      assertChipExists({ label: 'Company has name: False', position: 1 })

      // Check active and inactive
      cy.get('@True').check()
      assertPayload('@apiRequest', minimumPayload)
      assertChipExists({ label: 'Company has name: True', position: 1 })
      assertChipExists({ label: 'Company has name: False', position: 2 })

      // Remove chips
      removeChip(companyHasNoNameStatusFlag)
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
      has_name: true,
      archived: false,
      sortby: 'modified_on:desc',
      export_to_countries: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        export_to_countries: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Company activity details')
        .click()
      testTypeahead({
        element,
        label: 'Currently exporting to',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('export_to_countries', [brazilCountryId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 3 })
      removeChip(brazilCountryId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
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
      has_name: true,
      sortby: 'modified_on:desc',
      future_interest_countries: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        future_interest_countries: [brazilCountryId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Company activity details')
        .click()
      testTypeahead({
        element,
        label: 'Future countries of interest',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('future_interest_countries', [brazilCountryId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Brazil', position: 3 })
      removeChip(brazilCountryId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Export segment', () => {
    const element = '[data-test="export-segment-filter"]'
    const segmentValue = 'hep'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      export_segment: [segmentValue],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        export_segment: [segmentValue],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'High export potential')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'High export potential', position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Company activity details')
        .click()
      testTypeahead({
        element,
        label: 'Export Segment',
        placeholder: 'Search export segment',
        input: 'high',
        expectedOption: 'High export potential',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('export_segment', [segmentValue])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'High export potential', position: 3 })
      removeChip(segmentValue)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Export subsegment', () => {
    const element = '[data-test="export-sub-segment-filter"]'
    const subSegmentValue = 'sustain_nurture_and_grow'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      export_sub_segment: [subSegmentValue],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        export_sub_segment: [subSegmentValue],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Sustain: nurture & grow')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Sustain: nurture & grow', position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Company activity details')
        .click()
      testTypeahead({
        element,
        label: 'Export Subsegment',
        placeholder: 'Search export subsegment',
        input: 'sust',
        expectedOption: 'Sustain: nurture & grow',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('export_sub_segment', [subSegmentValue])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Sustain: nurture & grow', position: 3 })
      removeChip(subSegmentValue)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Last interaction dates', () => {
    const fromElement = '[data-test="last-interaction-after-filter"]'
    const fromDate = '2020-01-01'
    const formattedFromDate = '1 January 2020'
    const toElement = '[data-test="last-interaction-before-filter"]'
    const toDate = '2021-10-05'
    const formattedToDate = '5 October 2021'
    const expectedPayload = {
      ...minimumPayload,
      archived: false,
      has_name: true,
      latest_interaction_date_after: fromDate,
      latest_interaction_date_before: toDate,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        latest_interaction_date_after: fromDate,
        latest_interaction_date_before: toDate,
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertChipExists({
        label: `Last interaction from: ${formattedFromDate}`,
        position: 3,
      })
      assertChipExists({
        label: `Last interaction to: ${formattedToDate}`,
        position: 4,
      })
      assertDateInput({
        element: fromElement,
        label: 'Last interaction from',
        value: fromDate,
      })
      assertDateInput({
        element: toElement,
        label: 'Last interaction to',
        value: toDate,
      })
    })

    it('should filter from user input and remove the chip', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Company activity details')
        .click()
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

      assertQueryParams('latest_interaction_date_after', fromDate)
      assertQueryParams('latest_interaction_date_before', toDate)
      assertChipExists({
        label: `Last interaction from: ${formattedFromDate}`,
        position: 3,
      })
      assertChipExists({
        label: `Last interaction to: ${formattedToDate}`,
        position: 4,
      })
      assertDateInput({
        element: fromElement,
        label: 'Last interaction from',
        value: fromDate,
      })
      assertDateInput({
        element: toElement,
        label: 'Last interaction to',
        value: toDate,
      })

      removeChip(fromDate)
      cy.wait('@apiRequest')
      removeChip(toDate)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()

      assertDateInput({
        element: fromElement,
        label: 'Last interaction from',
        value: '',
      })
      assertDateInput({
        element: toElement,
        label: 'Last interaction to',
        value: '',
      })
    })
  })

  context('Lead ITA or global account manager', () => {
    const element = '[data-test="lead-ita-global-account-manager-filter"]'
    const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
    const adviserName = 'Puck Head'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      one_list_group_global_account_manager: [adviserId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        one_list_group_global_account_manager: [adviserId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [{ id: adviserId, name: adviserName }],
      }).as('adviserSearchApiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', adviserName)
      assertChipExists({ label: adviserName, position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [{ id: adviserId, name: adviserName }],
      }).as('adviserSearchApiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstMockedTypeaheadOption({ element, input: adviserName })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('one_list_group_global_account_manager', [adviserId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({
        label: `Lead ITA or global account manager: ${adviserName}`,
        position: 3,
      })
      removeChip(adviserId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Advisers', () => {
    const element = '[data-test="adviser-filter"]'
    const adviserId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
    const adviserName = 'Puck Head'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      archived: false,
      has_name: true,
      sortby: 'modified_on:desc',
      adviser: [adviserId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        adviser: [adviserId],
      })
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [{ id: adviserId, name: adviserName }],
      }).as('adviserSearchApiRequest')
      cy.visit(`/companies?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', adviserName)
      assertChipExists({ label: adviserName, position: 3 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [{ id: adviserId, name: adviserName }],
      }).as('adviserSearchApiRequest')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@apiRequest')

      selectFirstMockedTypeaheadOption({ element, input: adviserName })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('adviser', [adviserId])
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({
        label: `Adviser: ${adviserName}`,
        position: 3,
      })
      removeChip(adviserId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest')
      removeChip(companyHasNameStatusFlag)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const globalHqTypeId = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
      const ukCountryId = '80756b9a-5d95-e211-a939-e4115bead28a'
      const globalAccountManagerId = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
      const globalAccountManagerName = 'Puck Head'
      const adviserId = '7b7ad5ba-9d98-e211-a939-e4115bead28a'
      const adviserName = 'Bess Fowler'

      const advancedEngineeringSectorId = 'af959812-6095-e211-a939-e4115bead28a'
      const ukRegions = ukRegionListFaker(10)
      const usStates = administrativeAreaListFaker(20)
      const canadianProvinces = administrativeAreaListFaker(10)
      const queryString = qs.stringify({
        page: 1,
        headquarter_type: globalHqTypeId,
        name: 'Tesco',
        sector_descends: advancedEngineeringSectorId,
        country: [ukCountryId],
        us_state: [usStates[0].id],
        canadian_province: [canadianProvinces[0].id],
        uk_postcode: 'AB1 2CD, EF3 4GH',
        uk_region: [ukRegions[0].id],
        archived: [inactiveStatusFlag],
        export_to_countries: [ukCountryId],
        future_interest_countries: [ukCountryId],
        latest_interaction_date_after: '2018-07-25',
        latest_interaction_date_before: '2020-01-01',
        one_list_group_global_account_manager: [globalAccountManagerId],
        adviser: [adviserId],
        has_name: [true],
      })
      cy.intercept('GET', usStatesEndpoint, usStates).as('usStatesApiRequest')
      cy.intercept('GET', canadianProvincesEndpoint, canadianProvinces).as(
        'canadianProvincesApiRequest'
      )
      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        result: [{ id: adviserId, name: adviserName }],
      }).as('adviserSearchApiRequest1')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [
          { id: globalAccountManagerId, name: globalAccountManagerName },
        ],
      }).as('adviserSearchApiRequest2')
      cy.visit(`/companies?${queryString}`)
      cy.wait('@usStatesApiRequest')
      cy.wait('@canadianProvincesApiRequest')
      cy.wait('@ukRegionsApiRequest')
      cy.wait('@apiRequest')
    })

    it('should remove all filters and chips', () => {
      cy.get('[data-test=filter-chips]').children().as('filterChips')
      cy.get('@filterChips').should('have.length', 16)
      cy.get('[data-test=clear-filters]').click()
      cy.get('[data-test=filter-chips]').children().should('have.length', 0)
      assertCheckboxGroupNoneSelected('[data-test="headquarter-type-filter"]')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="country-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="uk-postcode-filter"]').should('have.value', '')
      cy.get('[data-test="us-state-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="canadian-province-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="uk-region-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      assertCheckboxGroupNoneSelected('[data-test="company-status-filter"]')
      assertCheckboxGroupNoneSelected('[data-test="company-has-name-filter"]')
      cy.get('[data-test="currently-exporting-to-country-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="future-countries-of-interest-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      assertDateInput({
        element: '[data-test="last-interaction-after-filter"]',
        label: 'Last interaction from',
        value: '',
      })
      assertDateInput({
        element: '[data-test="last-interaction-before-filter"]',
        label: 'Last interaction to',
        value: '',
      })
      cy.get('[data-test="lead-ita-global-account-manager-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="adviser-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
    })
  })
})
