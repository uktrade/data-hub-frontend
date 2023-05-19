import { exportFaker } from '../../fakers/export'

import { assertRequestUrl } from '../../support/assertions'
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
  const active = exportFaker({
    id: 1,
    status: 'active',
    export_potential: 'high',
  })
  const won = exportFaker({
    id: 2,
    status: 'won',
    export_potential: 'medium',
  })
  const inactive = exportFaker({
    id: 3,
    status: 'inactive',
    export_potential: 'low',
  })

  const exportList = [active, won, inactive]
  const exportTab = urls.exportPipeline.index()

  const endpoint = '/api-proxy/v4/export'
  const queryParams = 'limit=10&page=1&offset=0&archived=false'
  const requestUrl = `${endpoint}?${queryParams}`

  const interceptAPICalls = () => {
    // An unfiltered list
    cy.intercept('GET', requestUrl, {
      body: {
        count: exportList.length,
        results: exportList,
      },
    }).as('apiRequest')
    // Filtered by status
    cy.intercept('GET', `${requestUrl}&status=won`, {
      body: {
        count: exportList.length,
        results: exportList.filter((exp) => exp.status === 'won'),
      },
    }).as('apiRequestStatus')
    // Filtered by export potential
    cy.intercept('GET', `${requestUrl}&export_potential=high`, {
      body: {
        count: exportList.length,
        results: exportList.filter((exp) => exp.export_potential === 'high'),
      },
    }).as('apiRequestExportPotential')
  }

  context('Status', () => {
    const element = '[data-test="status-select"]'

    beforeEach(() => {
      interceptAPICalls()
    })

    it('should have a "Status" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequest')
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
      cy.wait('@apiRequest')
      cy.get(`${element} select`).select('won')
      assertRequestUrl('@apiRequestStatus', `${requestUrl}&status=won`)
      assertListItems({ length: 1 })
    })
  })

  context('Export potential', () => {
    const element = '[data-test="export-potential-select"]'

    beforeEach(() => {
      interceptAPICalls()
    })

    it('should have an "Export potential" filter', () => {
      cy.visit(exportTab)
      cy.wait('@apiRequest')
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
      cy.wait('@apiRequest')
      cy.get(`${element} select`).select('High')
      assertRequestUrl(
        '@apiRequestExportPotential',
        `${requestUrl}&export_potential=high`
      )
      assertListItems({ length: 1 })
    })
  })
})
