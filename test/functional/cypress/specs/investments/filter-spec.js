import qs from 'qs'

import urls from '../../../../../src/lib/urls'

import { ukRegionFaker, ukRegionListFaker } from '../../fakers/regions'
import {
  clickCheckboxGroupOption,
  inputDateValueWithHint,
  removeChip,
  selectFirstMockedTypeaheadOption,
} from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertChipsEmpty,
  assertChipExists,
  assertDateInputWithHint,
  assertFieldEmpty,
  assertPayload,
  assertTypeaheadOptionSelected,
  assertQueryParams,
} from '../../support/assertions'
import { testTypeahead, testTypeaheadOptionsLength } from '../../support/tests'
import { STAGE_PROSPECT } from '../../../../../src/client/modules/Investments/Projects/constants'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    page: 1,
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  include_parent_companies: false,
  include_subsidiary_companies: false,
}

const getFinancialYearStart = () => {
  const now = new Date()
  return now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear()
}

const yearStartToRange = (yearStart) =>
  `${yearStart}-${(yearStart + 1).toString().slice(-2)}`

const myAdviser = {
  id: '7d19d407-9aec-4d06-b190-d3f404627f21',
  name: 'Barry Oling',
}

const searchEndpoint = '/api-proxy/v3/search/investment_project'
const adviserSearchEndpoint = '/api-proxy/v4/search/adviser'
const adviserAutocompleteEndpoint = '/api-proxy/adviser/?autocomplete=*'
const ukRegionsEndpoint = '/api-proxy/v4/metadata/uk-region*'

describe('Investments Collections Filter', () => {
  context('Toggle groups', () => {
    it('should show stage and status filters and hide them on toggle', () => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit('/investments/projects')
      cy.wait('@apiRequest')
      cy.get('[data-test="stage-filter"]').should('be.visible')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Stage and status')
        .click()
      cy.get('[data-test="stage-filter"]').should('not.be.visible')
    })
  })

  context('Stage', () => {
    const element = '[data-test="stage-filter"]'

    const prospectStageId = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
    const expectedPayload = {
      offset: 0,
      limit: 10,
      stage: [prospectStageId],
      include_parent_companies: false,
      include_subsidiary_companies: false,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ stage: [prospectStageId] })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: prospectStageId,
        checked: true,
      })
      assertChipExists({ label: STAGE_PROSPECT, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: prospectStageId,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('stage[0]', prospectStageId)
      assertChipExists({ label: STAGE_PROSPECT, position: 1 })

      removeChip(prospectStageId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Advisers', () => {
    const expectedPayload = {
      ...minimumPayload,
      adviser: [myAdviser.id],
    }
    const advisersFilter = '[data-test="adviser-filter"]'
    const myProjectsFilter = '[data-test="my-projects-filter"]'

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        adviser: [myAdviser.id],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')

      cy.intercept('POST', adviserSearchEndpoint, {
        results: [myAdviser],
      }).as('adviserSearchApiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@adviserSearchApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      /*
      Asserts the "Adviser typeahead" filter is selected with the
      current user as this is the same as selecting "My projects".
      */
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: myAdviser.name,
      })
      assertCheckboxGroupOption({
        element: myProjectsFilter,
        value: myAdviser.id,
        checked: true,
      })
      assertChipExists({ label: myAdviser.name, position: 1 })
    })

    it('should filter from "my projects" input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [myAdviser],
      }).as('adviserSearchApiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Project details')
        .click()
      clickCheckboxGroupOption({
        element: myProjectsFilter,
        value: myAdviser.id,
      })
      cy.wait('@adviserSearchApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('adviser', [myAdviser.id])
      assertChipExists({ label: myAdviser.name, position: 1 })
      removeChip(myAdviser.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(myProjectsFilter)
    })

    it('should filter from "advisers" input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.intercept('POST', adviserSearchEndpoint, {
        results: [myAdviser],
      }).as('adviserSearchApiRequest')
      cy.intercept('GET', adviserAutocompleteEndpoint, {
        count: 1,
        results: [myAdviser],
      }).as('adviserListApiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Project details')
        .click()
      selectFirstMockedTypeaheadOption({
        element: advisersFilter,
        input: myAdviser.name,
        mockAdviserResponse: false,
      })
      cy.wait('@adviserListApiRequest')
      cy.wait('@adviserSearchApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('adviser', [myAdviser.id])
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: myAdviser.name,
      })
      /*
       Asserts the "My projects" filter checkbox as this should
      be checked if the adviser chosen is the same as the current user.
      */
      assertCheckboxGroupOption({
        element: myProjectsFilter,
        value: myAdviser.id,
        checked: true,
      })
      assertChipExists({
        label: myAdviser.name,
        position: 1,
      })

      removeChip(myAdviser.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(advisersFilter)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceSectorId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      sector_descends: [aerospaceSectorId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sector_descends: [aerospaceSectorId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Project details')
        .click()

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
      removeChip(aerospaceSectorId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const brazilCountryId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      country_investment_originates_from: [brazilCountryId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        country_investment_originates_from: [brazilCountryId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Location details')
        .click()

      testTypeahead({
        element,
        label: 'Country of company origin',
        placeholder: 'Search country',
        input: 'braz',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('country_investment_originates_from', [brazilCountryId])
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
    const ukRegions = [ukRegion, ...ukRegionListFaker(5)]
    const expectedPayload = {
      ...minimumPayload,
      uk_region_location: [ukRegion.id],
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
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
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
        uk_region_location: [ukRegion.id],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')

      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
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
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
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
      assertQueryParams('uk_region_location', [ukRegion.id])
      assertChipExists({ label: ukRegion.name, position: 1 })
      removeChip(ukRegion.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Project status', () => {
    const element = '[data-test="project-status-filter"]'
    const statusAbandoned = 'abandoned'
    const expectedPayload = {
      ...minimumPayload,
      status: [statusAbandoned],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ status: [statusAbandoned] })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: statusAbandoned,
        checked: true,
      })
      assertChipExists({ label: 'Abandoned', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: statusAbandoned,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('status[0]', statusAbandoned)
      assertChipExists({ label: 'Abandoned', position: 1 })

      removeChip(statusAbandoned)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Investment type', () => {
    const element = '[data-test="investment-type-filter"]'
    const investmentTypeFdi = '3e143372-496c-4d1e-8278-6fdd3da9b48b'
    const expectedPayload = {
      ...minimumPayload,
      investment_type: [investmentTypeFdi],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        investment_type: [investmentTypeFdi],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: investmentTypeFdi,
        checked: true,
      })
      assertChipExists({ label: 'FDI', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Investment and involvement details')
        .click()
      clickCheckboxGroupOption({
        element,
        value: investmentTypeFdi,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('investment_type[0]', investmentTypeFdi)
      assertChipExists({ label: 'FDI', position: 1 })

      removeChip(investmentTypeFdi)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Financial year', () => {
    const element = '[data-test="financial-year-filter"]'
    const yearStart = getFinancialYearStart()
    const yearRange = yearStartToRange(yearStart)
    const expectedPayload = {
      ...minimumPayload,
      land_date_financial_year_start: [`${yearStart}`],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        land_date_financial_year_start: [yearStart],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: yearStart,
        checked: true,
      })
      assertChipExists({ label: `Current year ${yearRange}`, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Project details')
        .click()

      clickCheckboxGroupOption({
        element,
        value: yearStart,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('land_date_financial_year_start[0]', yearStart)
      assertChipExists({ label: `Current year ${yearRange}`, position: 1 })

      removeChip(yearStart)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Likelihood of landing', () => {
    const element = '[data-test="likelihood-to-land-filter"]'
    const likelihoodToLandMedium = '683ca57b-bd69-462c-852f-d2177e35b2eb'
    const expectedPayload = {
      ...minimumPayload,
      likelihood_to_land: [likelihoodToLandMedium],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        likelihood_to_land: [likelihoodToLandMedium],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: likelihoodToLandMedium,
        checked: true,
      })
      assertChipExists({ label: 'Medium', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Land date details')
        .click()

      clickCheckboxGroupOption({
        element,
        value: likelihoodToLandMedium,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('likelihood_to_land[0]', likelihoodToLandMedium)
      assertChipExists({ label: 'Medium', position: 1 })

      removeChip(likelihoodToLandMedium)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Estimated land dates', () => {
    const fromElement = '[data-test="estimated-land-date-after-filter"]'
    const fromDate = '2020-01'
    const fromDateAPI = '2020-01-01'
    const formattedFromDate = 'January 2020'
    const toElement = '[data-test="estimated-land-date-before-filter"]'
    const toDate = '2021-10'
    const toDateAPI = '2021-10-01'
    const formattedToDate = 'October 2021'
    const expectedPayload = {
      ...minimumPayload,
      estimated_land_date_after: fromDateAPI,
      estimated_land_date_before: toDateAPI,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        estimated_land_date_after: fromDate,
        estimated_land_date_before: toDate,
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertChipExists({
        label: `Estimated land date to: ${formattedToDate}`,
        position: 1,
      })
      assertChipExists({
        label: `Estimated land date from: ${formattedFromDate}`,
        position: 2,
      })
      assertDateInputWithHint({
        element: fromElement,
        label: 'Estimated land date from',
        value: fromDate,
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Estimated land date to',
        value: toDate,
      })
    })

    it('should filter from user input and remove the chip', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Land date details')
        .click()
      inputDateValueWithHint({
        element: fromElement,
        value: fromDate,
      })
      cy.wait('@apiRequest')
      inputDateValueWithHint({
        element: toElement,
        value: toDate,
      })
      assertPayload('@apiRequest', expectedPayload)

      assertQueryParams('estimated_land_date_after', fromDate)
      assertQueryParams('estimated_land_date_before', toDate)
      assertChipExists({
        label: `Estimated land date to: ${formattedToDate}`,
        position: 1,
      })
      assertChipExists({
        label: `Estimated land date from: ${formattedFromDate}`,
        position: 2,
      })
      assertDateInputWithHint({
        element: fromElement,
        label: 'Estimated land date from',
        value: fromDate,
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Estimated land date to',
        value: toDate,
      })

      removeChip(fromDate)
      cy.wait('@apiRequest')
      removeChip(toDate)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()

      assertDateInputWithHint({
        element: fromElement,
        label: 'Estimated land date from',
        value: '',
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Estimated land date to',
        value: '',
      })
    })
  })

  context('Actual land dates', () => {
    const fromElement = '[data-test="actual-land-date-after-filter"]'
    const fromDate = '2020-01'
    const fromDateAPI = '2020-01-01'
    const formattedFromDate = 'January 2020'
    const toElement = '[data-test="actual-land-date-before-filter"]'
    const toDate = '2021-10'
    const toDateAPI = '2021-10-01'
    const formattedToDate = 'October 2021'
    const expectedPayload = {
      ...minimumPayload,
      actual_land_date_after: fromDateAPI,
      actual_land_date_before: toDateAPI,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        actual_land_date_after: fromDate,
        actual_land_date_before: toDate,
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertChipExists({
        label: `Actual land date to: ${formattedToDate}`,
        position: 1,
      })
      assertChipExists({
        label: `Actual land date from: ${formattedFromDate}`,
        position: 2,
      })
      assertDateInputWithHint({
        element: fromElement,
        label: 'Actual land date from',
        value: fromDate,
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Actual land date to',
        value: toDate,
      })
    })

    it('should filter from user input and remove the chip', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Land date details')
        .click()
      inputDateValueWithHint({
        element: fromElement,
        value: fromDate,
      })
      cy.wait('@apiRequest')
      inputDateValueWithHint({
        element: toElement,
        value: toDate,
      })
      assertPayload('@apiRequest', expectedPayload)

      assertQueryParams('actual_land_date_after', fromDate)
      assertQueryParams('actual_land_date_before', toDate)
      assertChipExists({
        label: `Actual land date to: ${formattedToDate}`,
        position: 1,
      })
      assertChipExists({
        label: `Actual land date from: ${formattedFromDate}`,
        position: 2,
      })
      assertDateInputWithHint({
        element: fromElement,
        label: 'Actual land date from',
        value: fromDate,
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Actual land date to',
        value: toDate,
      })

      removeChip(fromDate)
      cy.wait('@apiRequest')
      removeChip(toDate)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()

      assertDateInputWithHint({
        element: fromElement,
        label: 'Actual land date from',
        value: '',
      })
      assertDateInputWithHint({
        element: toElement,
        label: 'Actual land date to',
        value: '',
      })
    })
  })

  context('Involvement level', () => {
    const element = '[data-test="involvement-level-filter"]'
    const involvementLevelUnspecified = 'unspecified'
    const expectedPayload = {
      ...minimumPayload,
      level_of_involvement_simplified: [involvementLevelUnspecified],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        level_of_involvement_simplified: [involvementLevelUnspecified],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      assertCheckboxGroupOption({
        element,
        value: involvementLevelUnspecified,
        checked: true,
      })
      assertChipExists({ label: 'Unspecified', position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${urls.investments.projects.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Investment and involvement details')
        .click()

      clickCheckboxGroupOption({
        element,
        value: involvementLevelUnspecified,
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams(
        'level_of_involvement_simplified[0]',
        involvementLevelUnspecified
      )
      assertChipExists({ label: 'Unspecified', position: 1 })

      removeChip(involvementLevelUnspecified)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })
})
