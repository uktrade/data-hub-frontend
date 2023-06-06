import qs from 'qs'

import { assertRequestUrl, assertDateInput } from '../../support/assertions'
import { inputDateValue } from '../../support/actions'
import { exportFaker } from '../../fakers/export'
import { sectorFaker } from '../../fakers/sectors'
import { countryFaker } from '../../fakers/countries'
import urls from '../../../../../src/lib/urls'

const transformOptions = (options) =>
  [...options].map((o) => ({
    value: o.value,
    label: o.label,
  }))

const assertListItems = ({ length }) => {
  cy.get('[data-test="export-item"]').should('have.length', length)
}

describe('Export filters', () => {
  const endpoint = '/api-proxy/v4/export'
  const queryParams = 'limit=10&page=1&offset=0&archived=false'
  const requestUrl = `${endpoint}?${queryParams}`
  const exportTab = urls.exportPipeline.index()

  const exportList = [
    exportFaker({
      id: 1,
      status: 'active',
      export_potential: 'high',
      sector: {
        name: 'Advanced Engineering',
        id: '1',
      },
      destination_country: {
        name: 'Thailand',
        id: '1',
      },
      estimated_win_date: '2023-01-01',
      owner: {
        name: 'Warren Buffet',
        id: '1',
      },
      team_members: [
        {
          name: 'Peter Lynch',
          id: '3',
        },
      ],
    }),
    exportFaker({
      id: 2,
      status: 'won',
      export_potential: 'medium',
      sector: {
        id: '2',
        name: 'Aerospace',
      },
      destination_country: {
        id: '2',
        name: 'The Bahamas',
      },
      estimated_win_date: '2023-02-01',
      owner: {
        name: 'Benjamin Graham',
        id: '2',
      },
      team_members: [
        {
          name: 'Warren Buffet',
          id: '1',
        },
      ],
    }),
    exportFaker({
      id: 3,
      status: 'inactive',
      export_potential: 'low',
      sector: {
        id: '3',
        name: 'Airports',
      },
      destination_country: {
        id: '3',
        name: 'St Lucia',
      },
      estimated_win_date: '2023-03-01',
      owner: {
        name: 'Peter Lynch',
        id: '3',
      },
      team_members: [],
    }),
  ]

  beforeEach(() => {
    cy.intercept('GET', requestUrl, {
      body: {
        count: exportList.length,
        results: exportList,
      },
    }).as('apiRequestList')
    cy.intercept('GET', '/api-proxy/v4/export/owner', [
      { name: 'Warren Buffet', id: '1' },
      { name: 'Benjamin Graham', id: '2' },
    ]).as('apiRequestOwnersSelect')
  })

  context('Status', () => {
    const element = '[data-test="status-select"]'

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&status=won`, {
        body: {
          count: exportList.length,
          results: exportList.filter((exp) => exp.status === 'won'),
        },
      }).as('apiRequestStatus')
    })

    it('should have a "Status" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.get(element).find('span').should('have.text', 'Status')
      cy.get(`${element} option`).then((statusOptions) => {
        expect(transformOptions(statusOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'active', label: 'Active' },
          { value: 'won', label: 'Won' },
          { value: 'inactive', label: 'Inactive' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.visit(`${exportTab}?status=won`)
      assertRequestUrl('@apiRequestStatus', `${requestUrl}&status=won`)
      assertListItems({ length: 1 })
      cy.get(`${element} select`).find(':selected').contains('Won')
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.get(`${element} select`).select('won')
      assertRequestUrl('@apiRequestStatus', `${requestUrl}&status=won`)
      assertListItems({ length: 1 })
    })
  })

  context('Export potential', () => {
    const element = '[data-test="export-potential-select"]'

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&export_potential=high`, {
        body: {
          count: exportList.length,
          results: exportList.filter((exp) => exp.export_potential === 'high'),
        },
      }).as('apiRequestExportPotential')
    })

    it('should have an "Export potential" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.get(element).find('span').should('have.text', 'Export potential')
      cy.get(`${element} option`).then((statusOptions) => {
        expect(transformOptions(statusOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.visit(`${exportTab}?export_potential=high`)
      assertRequestUrl(
        '@apiRequestExportPotential',
        `${requestUrl}&export_potential=high`
      )
      assertListItems({ length: 1 })
      cy.get(`${element} select`).find(':selected').contains('High')
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.get(`${element} select`).select('High')
      assertRequestUrl(
        '@apiRequestExportPotential',
        `${requestUrl}&export_potential=high`
      )
      assertListItems({ length: 1 })
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-select"]'
    const sectors = [
      sectorFaker({
        id: 1,
        name: 'Advanced Engineering',
      }),
      sectorFaker({
        id: 2,
        name: 'Aerospace',
      }),
      sectorFaker({
        id: 3,
        name: 'Airports',
      }),
    ]

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&sector=1`, {
        body: {
          count: exportList.length,
          results: exportList.filter((exp) => exp.sector.id === '1'), // Advanced Engineering
        },
      }).as('apiRequestSector')
      cy.intercept('GET', `${urls.metadata.sector()}?level__lte=2`, sectors).as(
        'apiRequestMetadataSector'
      )
    })

    it('should have a "Sector" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestMetadataSector')
      cy.get(element).find('span').should('have.text', 'Sector')
      cy.get(`${element} option`).then((sectorOptions) => {
        expect(transformOptions(sectorOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: '1', label: 'Advanced Engineering' },
          { value: '2', label: 'Aerospace' },
          { value: '3', label: 'Airports' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.visit(`${exportTab}?sector=1`)
      assertRequestUrl('@apiRequestSector', `${requestUrl}&sector=1`)
      assertListItems({ length: 1 })
      cy.get(`${element} select`)
        .find(':selected')
        .contains('Advanced Engineering')
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestMetadataSector')
      cy.get(`${element} select`).select('Advanced Engineering')
      assertRequestUrl('@apiRequestSector', `${requestUrl}&sector=1`)
      assertListItems({ length: 1 })
    })
  })

  context('Country', () => {
    const element = '[data-test="destination-country-select"]'
    const countries = [
      countryFaker({
        id: 1,
        name: 'Thailand',
      }),
      countryFaker({
        id: 2,
        name: 'The Bahamas',
      }),
      countryFaker({
        id: 3,
        name: 'St Lucia',
      }),
    ]

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&destination_country=3`, {
        body: {
          count: exportList.length,
          results: exportList.filter(
            (exp) => exp.destination_country.id === '3' // St Lucia
          ),
        },
      }).as('apiRequestCountry')
      cy.intercept('GET', urls.metadata.country(), countries).as(
        'apiRequestMetadataCountry'
      )
    })

    it('should have a "Country" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestMetadataCountry')
      cy.get(element).find('span').should('have.text', 'Country')
      cy.get(`${element} option`).then((sectorOptions) => {
        expect(transformOptions(sectorOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: '1', label: 'Thailand' },
          { value: '2', label: 'The Bahamas' },
          { value: '3', label: 'St Lucia' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.visit(`${exportTab}?destination_country=3`)
      assertRequestUrl(
        '@apiRequestCountry',
        `${requestUrl}&destination_country=3`
      )
      assertListItems({ length: 1 })
      cy.get(`${element} select`).find(':selected').contains('St Lucia')
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestMetadataCountry')
      cy.get(`${element} select`).select('St Lucia')
      assertRequestUrl(
        '@apiRequestCountry',
        `${requestUrl}&destination_country=3`
      )
      assertListItems({ length: 1 })
    })
  })

  context('Estimated win date', () => {
    // From
    const afterElement = '[data-test="estimated-win-date-after"]'
    const afterDate = '2023-01'
    const afterDateAPI = '2023-01-01'
    const afterQueryParamsApi = `estimated_win_date_after=${afterDateAPI}`
    // To
    const beforeElement = '[data-test="estimated-win-date-before"]'
    const beforeDate = '2023-02'
    const beforeDateAPI = '2023-02-01'
    const beforeQueryParamsApi = `estimated_win_date_before=${beforeDateAPI}`

    beforeEach(() => {
      // From
      cy.intercept('GET', `${requestUrl}&${afterQueryParamsApi}`, {
        body: {
          count: exportList.length,
          results: exportList,
        },
      })
      // From and To
      cy.intercept(
        'GET',
        `${requestUrl}&${afterQueryParamsApi}&${beforeQueryParamsApi}`,
        {
          body: {
            count: exportList.length,
            results: exportList,
          },
        }
      ).as('apiRequestAfterBefore')
    })

    it('should have 2 calendars for filtering on month', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.get(afterElement).find('input').should('have.attr', 'type', 'month')
      cy.get(beforeElement).find('input').should('have.attr', 'type', 'month')
    })

    it('should filter from the url', () => {
      const queryParams = qs.stringify({
        estimated_win_date_after: afterDate,
        estimated_win_date_before: beforeDate,
      })
      cy.visit(`${exportTab}?${queryParams}`)
      assertRequestUrl(
        '@apiRequestAfterBefore',
        `${requestUrl}&${afterQueryParamsApi}&${beforeQueryParamsApi}`
      )
      assertDateInput({
        element: afterElement,
        label: 'Win date from',
        value: afterDate,
      })
      assertDateInput({
        element: beforeElement,
        label: 'Win date to',
        value: beforeDate,
      })
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      inputDateValue({
        element: afterElement,
        value: afterDate,
      })
      inputDateValue({
        element: beforeElement,
        value: beforeDate,
      })
      assertRequestUrl(
        '@apiRequestAfterBefore',
        `${requestUrl}&${afterQueryParamsApi}&${beforeQueryParamsApi}`
      )
    })
  })

  context('Owner', () => {
    const element = '[data-test="owner-select"]'

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&owner=1`, {
        body: {
          count: 2,
          results: exportList.slice(0, 2),
        },
      }).as('apiRequestListOwners')
    })

    it('should have an "Owner" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestOwnersSelect')
      cy.get(element).find('span').should('have.text', 'Owner')
      cy.get(`${element} option`).then((sectorOptions) => {
        expect(transformOptions(sectorOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: '1', label: 'Warren Buffet' },
          { value: '2', label: 'Benjamin Graham' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.visit(`${exportTab}?owner=1`)
      assertRequestUrl('@apiRequestListOwners', `${requestUrl}&owner=1`)
      assertListItems({ length: 2 })
      cy.get(`${element} select`).find(':selected').contains('Warren Buffet')
    })

    it('should filter from user input', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequestList')
      cy.wait('@apiRequestOwnersSelect')
      cy.get(`${element} select`).select('Warren Buffet')
      assertListItems({ length: 2 })
      assertRequestUrl('@apiRequestListOwners', `${requestUrl}&owner=1`)
    })
  })
})
