import {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
  assertQueryParams,
  assertChipExists,
  assertCheckboxGroupOption,
  assertTypeaheadHints,
  assertTypeaheadOptionSelected,
} from '../../support/assertions'
import {
  clickCheckboxGroupOption,
  selectFirstTypeaheadOption,
} from '../../support/actions'
import { investments } from '../../../../../src/lib/urls'
import { format } from '../../../../../src/client/utils/date'
import { eybLeadFaker } from '../../fakers/eyb-leads'
import { VALUES_VALUE_TO_LABEL_MAP } from '../../../../../src/client/modules/Investments/EYBLeads/constants'

const EYB_RETRIEVE_API_ROUTE = '/api-proxy/v4/investment-lead/eyb'

const FILTER_ELEMENTS = {
  company: '[data-test="company-name-filter"]',
  sector: '[data-test="sector-filter"]',
  value: '[data-test="lead-value-filter"]',
  country: '[data-test="lead-country-filter"]',
  overseas_region: '[data-test="overseas-region-filter"]',
}

const DATE_TIME_STRING = '2024-09-25T08:30:00.000000Z'
const COMPANY_NAME = 'Frost'
const COMPANY_NAME_DEFAULT = 'Mars'
const SECTOR_NAME = 'Mining'
const SECTOR_ID = 'a622c9d2-5f95-e211-a939-e4115bead28a'
const HIGH_VALUE = 'high'
const HIGH_VALUE_LABEL = 'High value'
const LOW_VALUE = 'low'
const LOW_VALUE_LABEL = 'Low value'
const UNKNOWN_VALUE = 'unknown'
const UNKNOWN_VALUE_LABEL = 'Unknown value'
const COUNTRY_NAME_1 = 'Canada'
const COUNTRY_ID_1 = '5daf72a6-5d95-e211-a939-e4115bead28a'
const COUNTRY_NAME_2 = 'Brazil'
const COUNTRY_ID_2 = 'b05f66a0-5d95-e211-a939-e4115bead28a'
const OVERSEAS_REGION_NAME_1 = 'North America'
const OVERSEAS_REGION_ID_1 = 'fdfbbc8d-0e8a-479a-b10f-4979d582ff87'
const OVERSEAS_REGION_NAME_2 = 'Latin America'
const OVERSEAS_REGION_ID_2 = '5616ccf5-ab4a-4c2c-9624-13c69be3c46b'

const EYB_LEAD_LIST = Array(
  eybLeadFaker({
    triage_created: DATE_TIME_STRING,
    company: { name: `${COMPANY_NAME} and Co` },
    is_high_value: true,
    country: {
      name: COUNTRY_NAME_1,
      id: COUNTRY_ID_1,
      overseas_region: {
        name: OVERSEAS_REGION_NAME_1,
        id: OVERSEAS_REGION_ID_1,
      },
    },
  }),
  eybLeadFaker({
    triage_created: DATE_TIME_STRING,
    sector: { name: SECTOR_NAME, id: SECTOR_ID },
    is_high_value: false,
    country: {
      name: COUNTRY_NAME_1,
      id: COUNTRY_ID_1,
      overseas_region: {
        name: OVERSEAS_REGION_NAME_1,
        id: OVERSEAS_REGION_ID_1,
      },
    },
  }),
  eybLeadFaker({ triage_created: DATE_TIME_STRING, is_high_value: null }),
  eybLeadFaker({ triage_created: DATE_TIME_STRING, is_high_value: false }),
  eybLeadFaker({
    triage_created: DATE_TIME_STRING,
    is_high_value: false,
    company: null,
    company_name: COMPANY_NAME_DEFAULT,
    country: {
      name: COUNTRY_NAME_2,
      id: COUNTRY_ID_2,
      overseas_region: {
        name: OVERSEAS_REGION_NAME_2,
        id: OVERSEAS_REGION_ID_2,
      },
    },
  })
)

const PAYLOADS = {
  minimum: { limit: '10', offset: '0' },
  companyFilter: { company: COMPANY_NAME },
  sectorFilter: { sector: SECTOR_ID },
  highValueFilter: { value: HIGH_VALUE },
  lowValueFilter: { value: LOW_VALUE },
  unknownValueFilter: { value: UNKNOWN_VALUE },
  countryFilter: { country: COUNTRY_ID_1 },
}

const buildQueryString = (queryParams = {}) =>
  new URLSearchParams({
    page: 1, // default params
    ...queryParams,
  }).toString()

const getEYBLeadsByCompanyName = (companyName) => {
  return EYB_LEAD_LIST.filter(
    (lead) => lead.company && lead.company.name.includes(companyName)
  )
}

const getEYBLeadsBySectorId = (sectorId) => {
  return EYB_LEAD_LIST.filter(
    (lead) => lead.sector && lead.sector.id === sectorId
  )
}

const convertValueStringToBoolean = (value) => {
  if (value === 'high') return true
  if (value === 'low') return false
  if (value === 'unknown') return null
  throw new Error('Invalid value: must be either "high", "low", or "unknown"')
}

const getEYBLeadsByValue = (valueOfLead) => {
  const isHighValueBoolean = convertValueStringToBoolean(valueOfLead)
  return EYB_LEAD_LIST.filter(
    (lead) => lead.is_high_value === isHighValueBoolean
  )
}

const getEYBLeadsByCountryId = (countryId) => {
  return EYB_LEAD_LIST.filter(
    (lead) => lead.country && lead.country.id === countryId
  )
}

const getEYBLeadsByOverseasRegionId = (overseasRegionID) => {
  return EYB_LEAD_LIST.filter(
    (lead) =>
      lead.country && lead.country?.overseas_region.id === overseasRegionID
  )
}

describe('EYB leads collection page', () => {
  context('When visiting the EYB leads tab', () => {
    const eybLead = EYB_LEAD_LIST[0]

    beforeEach(() => {
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
        statusCode: 200,
        body: {
          count: EYB_LEAD_LIST.length,
          next: null,
          previous: null,
          results: EYB_LEAD_LIST,
        },
      }).as('apiRequest')
      cy.visit(investments.eybLeads.index())
      cy.wait('@apiRequest')
    })

    it('should render the header', () => {
      assertLocalHeader('EYB leads')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        'EYB leads': null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('EYB leads')
      assertTabbedLocalNav('Investor profiles')
      assertTabbedLocalNav('UK opportunities')
    })

    it('should render the filters', () => {
      cy.get('[data-test="overseas-region-filter"]').should('be.visible')
      cy.get('[data-test="lead-country-filter"]').should('be.visible')
      cy.get('[data-test="lead-value-filter"]').should('be.visible')
      cy.get('[data-test="sector-filter"]').should('be.visible')
      cy.get('[data-test="company-name-filter"]').should('be.visible')
    })

    it('should display the leads correctly', () => {
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        EYB_LEAD_LIST.length
      )
    })

    it('should display the metadata for each collection item correctly', () => {
      cy.get('[data-test="collection-item"]')
        .eq(0)
        .should('contain', eybLead.company.name)
        .should(
          'contain',
          `Submitted to EYB ${format(eybLead.triage_created, 'dd MMM yyyy')}`
        )
        .should('contain', `Estimated spend ${eybLead.spend}`)
        .should('contain', `Sector ${eybLead.sector.name}`)
        .should('contain', `Estimated land date ${eybLead.landing_timeframe}`)
        .should(
          'contain',
          `Location ${eybLead.proposed_investment_region.name}`
        )
        .should(
          'contain',
          VALUES_VALUE_TO_LABEL_MAP[eybLead.is_high_value].toUpperCase()
        )
    })
    it('should display the other name when company is null for a collection item', () => {
      cy.get('[data-test="collection-item"]')
        .eq(4)
        .should('contain', COMPANY_NAME_DEFAULT)
    })
  })

  context('When filtering the EYB leads collection by company name', () => {
    let expectedPayload = {
      ...PAYLOADS.minimum,
      ...PAYLOADS.companyFilter,
    }

    it('should filter from the url', () => {
      let queryString = buildQueryString({ company: COMPANY_NAME })
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
    })

    it('should filter from user input', () => {
      cy.visit(`${investments.eybLeads.index()}`)
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      cy.get(FILTER_ELEMENTS.company).type(`${COMPANY_NAME}{enter}`)
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
      assertQueryParams('company', COMPANY_NAME)
      assertChipExists({ label: COMPANY_NAME, position: 1 })
    })

    it('should return and display the filtered collection', () => {
      let queryString = buildQueryString({ company: COMPANY_NAME })
      let expectedNumberOfResults = 1 // Number of leads with COMPANY_NAME in the fixture data
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
        statusCode: 200,
        body: {
          count: expectedNumberOfResults,
          next: null,
          previous: null,
          results: getEYBLeadsByCompanyName(COMPANY_NAME),
        },
      }).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        expectedNumberOfResults
      )
    })
  })

  context('When filtering the EYB leads collection by sector', () => {
    let expectedPayload = {
      ...PAYLOADS.minimum,
      ...PAYLOADS.sector,
    }

    it('should filter from the url', () => {
      let queryString = buildQueryString({ 'sector[0]': SECTOR_ID })
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
    })

    it('should filter from user input', () => {
      cy.visit(`${investments.eybLeads.index()}`)
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      assertTypeaheadHints({
        element: FILTER_ELEMENTS.sector,
        label: 'Sector of interest',
        placeholder: 'Search sector',
      })
      selectFirstTypeaheadOption({
        element: FILTER_ELEMENTS.sector,
        input: 'mini',
      })
      assertTypeaheadOptionSelected({
        element: FILTER_ELEMENTS.sector,
        expectedOption: SECTOR_NAME,
      })
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
      assertQueryParams('sector[0]', SECTOR_ID)
      assertChipExists({ label: SECTOR_NAME, position: 1 })
    })

    it('should return and display the filtered collection', () => {
      let queryString = buildQueryString({ 'sector[0]': SECTOR_ID })
      let expectedNumberOfResults = 1 // Number of leads with SECTOR_ID in the fixture data
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
        statusCode: 200,
        body: {
          count: expectedNumberOfResults,
          next: null,
          previous: null,
          results: getEYBLeadsBySectorId(SECTOR_ID),
        },
      }).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        expectedNumberOfResults
      )
    })
  })

  context(
    'When filtering the EYB leads collection by value of leads (repeats test case for "high", "low", and "unknown")',
    () => {
      const testCases = [
        {
          queryParamValue: HIGH_VALUE,
          expectedPayload: {
            ...PAYLOADS.minimum,
            ...PAYLOADS.highValueFilter,
          },
          chipsLabel: HIGH_VALUE_LABEL,
          expectedNumberOfResults: 1,
        },
        {
          queryParamValue: LOW_VALUE,
          expectedPayload: {
            ...PAYLOADS.minimum,
            ...PAYLOADS.lowValueFilter,
          },
          chipsLabel: LOW_VALUE_LABEL,
          expectedNumberOfResults: 3,
        },
        {
          queryParamValue: UNKNOWN_VALUE,
          expectedPayload: {
            ...PAYLOADS.minimum,
            ...PAYLOADS.unknownValueFilter,
          },
          chipsLabel: UNKNOWN_VALUE_LABEL,
          expectedNumberOfResults: 1,
        },
      ]

      testCases.forEach((testCase) => {
        it('should filter from the url', () => {
          let queryString = buildQueryString({
            'value[0]': testCase.queryParamValue,
          })
          cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
          cy.visit(`${investments.eybLeads.index()}?${queryString}`)
          cy.wait('@apiRequest')
            .its('request.query')
            .should('include', testCase.expectedPayload)
          assertCheckboxGroupOption({
            element: FILTER_ELEMENTS.value,
            value: testCase.queryParamValue,
            checked: true,
          })
          assertChipExists({ label: testCase.chipsLabel, position: 1 })
        })

        it('should filter from user input', () => {
          cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
          cy.visit(`${investments.eybLeads.index()}`)
          cy.wait('@apiRequest')
          clickCheckboxGroupOption({
            element: FILTER_ELEMENTS.value,
            value: testCase.queryParamValue,
          })
          cy.wait('@apiRequest')
            .its('request.query')
            .should('include', testCase.expectedPayload)
          assertQueryParams('value[0]', testCase.queryParamValue)
          assertChipExists({ label: testCase.chipsLabel, position: 1 })
        })

        it('should return and display the filtered collection', () => {
          let queryString = buildQueryString({
            'value[0]': testCase.queryParamValue,
          })
          cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
            statusCode: 200,
            body: {
              count: testCase.expectedNumberOfResults,
              next: null,
              previous: null,
              results: getEYBLeadsByValue(testCase.queryParamValue),
            },
          }).as('apiRequest')
          cy.visit(`${investments.eybLeads.index()}?${queryString}`)
          cy.wait('@apiRequest')
          cy.get('[data-test="collection-item"]').should(
            'have.length',
            testCase.expectedNumberOfResults
          )
        })
      })
    }
  )

  context('When filtering the EYB leads collection by country', () => {
    let expectedPayload = {
      ...PAYLOADS.minimum,
      ...PAYLOADS.country,
    }

    it('should filter from the url', () => {
      let queryString = buildQueryString({ 'country[0]': COUNTRY_ID_1 })
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
    })

    it('should filter from user input', () => {
      cy.visit(`${investments.eybLeads.index()}`)
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
      assertTypeaheadHints({
        element: FILTER_ELEMENTS.country,
        label: 'Country',
        placeholder: 'Search country',
      })
      selectFirstTypeaheadOption({
        element: FILTER_ELEMENTS.country,
        input: 'cana',
      })
      assertTypeaheadOptionSelected({
        element: FILTER_ELEMENTS.country,
        expectedOption: COUNTRY_NAME_1,
      })
      cy.wait('@apiRequest')
        .its('request.query')
        .should('include', expectedPayload)
      assertQueryParams('country[0]', COUNTRY_ID_1)
      assertChipExists({ label: COUNTRY_NAME_1, position: 1 })
    })

    it('should return and display the filtered collection', () => {
      const queryString = buildQueryString({ 'country[0]': COUNTRY_ID_1 })
      const expectedNumberOfResults = 2 // Number of leads with COUNTRY_ID_1 in the fixture data
      cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
        statusCode: 200,
        body: {
          count: expectedNumberOfResults,
          next: null,
          previous: null,
          results: getEYBLeadsByCountryId(COUNTRY_ID_1),
        },
      }).as('apiRequest')
      cy.visit(`${investments.eybLeads.index()}?${queryString}`)
      cy.wait('@apiRequest')
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        expectedNumberOfResults
      )
    })
  })

  context(
    'When filtering the EYB leads collection by HMTC (overseas) region',
    () => {
      const expectedPayload = {
        ...PAYLOADS.minimum,
        ...PAYLOADS.country,
      }

      it('should filter from the url', () => {
        const queryString = buildQueryString({
          'overseas_region[0]': OVERSEAS_REGION_ID_1,
        })
        cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
        cy.visit(`${investments.eybLeads.index()}?${queryString}`)
        cy.wait('@apiRequest')
          .its('request.query')
          .should('include', expectedPayload)
      })

      it('should filter from user input', () => {
        cy.visit(`${investments.eybLeads.index()}`)
        cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`).as('apiRequest')
        assertTypeaheadHints({
          element: FILTER_ELEMENTS.overseas_region,
          label: 'HMTC region',
          placeholder: 'Search HMTC region',
        })
        selectFirstTypeaheadOption({
          element: FILTER_ELEMENTS.overseas_region,
          input: 'north',
        })
        assertTypeaheadOptionSelected({
          element: FILTER_ELEMENTS.overseas_region,
          expectedOption: OVERSEAS_REGION_NAME_1,
        })
        cy.wait('@apiRequest')
          .its('request.query')
          .should('include', expectedPayload)
        assertQueryParams('overseas_region[0]', OVERSEAS_REGION_ID_1)
        assertChipExists({ label: OVERSEAS_REGION_NAME_1, position: 1 })
      })

      it('should return and display the filtered collection', () => {
        const queryString = buildQueryString({
          'overseas_region[0]': OVERSEAS_REGION_ID_1,
        })
        const expectedNumberOfResults = 2 // Number of leads with OVERSEAS_REGION_ID_1 in the fixture data
        cy.intercept('GET', `${EYB_RETRIEVE_API_ROUTE}?*`, {
          statusCode: 200,
          body: {
            count: expectedNumberOfResults,
            next: null,
            previous: null,
            results: getEYBLeadsByOverseasRegionId(OVERSEAS_REGION_ID_1),
          },
        }).as('apiRequest')
        cy.visit(`${investments.eybLeads.index()}?${queryString}`)
        cy.wait('@apiRequest')
        cy.get('[data-test="collection-item"]').should(
          'have.length',
          expectedNumberOfResults
        )
      })
    }
  )
})
