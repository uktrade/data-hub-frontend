import qs from 'qs'

import { exportListFaker, exportFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

describe('Export win user feature groups', () => {
  const company = '/companies/00009ae3-1912-e411-8a2b-e4115bead28a/overview'

  context('Company page"', () => {
    it('should show the "Add export win" button when the feature is active', () => {
      cy.setUserFeatureGroups(['export-wins'])
      cy.visit(company)
      cy.get('[data-test="header-add-export-win"]').should('exist')
    })
    it('should hide the "Add export win" button when the feature is inactive', () => {
      cy.setUserFeatureGroups([])
      cy.visit(company)
      cy.get('[data-test="header-add-export-win"]').should('not.exist')
    })
  })

  context('Dashboard"', () => {
    const exports = exportListFaker(3)
    const endpoint = '/api-proxy/v4/export'
    const queryParams = qs.stringify({
      limit: 10,
      page: 1,
      offset: 0,
      archived: false,
      sortby: 'created_on:desc',
    })

    beforeEach(() => {
      cy.intercept('GET', `${endpoint}?${queryParams}`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqList')
      cy.intercept('GET', '/api-proxy/v4/export/owner', [])
    })

    it('should show the "Export wins" link when the feature is active', () => {
      cy.setUserFeatureGroups(['export-wins'])
      cy.visit(urls.exportPipeline.index())
      cy.contains('View export wins')
    })

    it('should hide the "Export wins" link when the feature is inactive', () => {
      cy.setUserFeatureGroups([])
      cy.visit(urls.exportPipeline.index())
      cy.contains('View export wins').should('not.exist')
    })
  })

  context('Export project details page"', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/v4/export/1', exportFaker()).as(
        'apiRequest'
      )
    })

    it('should show the "Convert to export win" button when the feature is active', () => {
      cy.setUserFeatureGroups(['export-wins'])
      cy.visit(urls.exportPipeline.details('1'))
      cy.get('[data-test="convert-to-export-win"]').should('exist')
    })

    it('should hide the "Convert to export win" button when the feature is inactive', () => {
      cy.setUserFeatureGroups([])
      cy.visit(urls.exportPipeline.details('1'))
      cy.get('[data-test="convert-to-export-win"]').should('not.exist')
    })
  })
})
