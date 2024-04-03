import qs from 'qs'

import { exportListFaker, exportFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const API_BASE = Cypress.config('baseUrl')

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

  context('Links to export wins dashboard', () => {
    const EXPORT_RESPONSE = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: '44d4a54f-3a04-471e-8f24-fcb11cd204b7',
          company: {
            name: 'SUPERAWESOME LIMITED',
            id: 'ef09f1be-228d-4506-bdde-bb6d3562487d',
          },
          owner: {
            name: 'Paul Gain',
            first_name: 'Paul',
            last_name: 'Gain',
            dit_team: {
              name: 'Digital Data Hub - Live Service',
              id: '76a9ed9f-c9ff-4569-8a9a-8f20b63c97ef',
            },
            id: '73d89d55-68b2-4bb9-9c7c-eedbb1548b94',
          },
          team_members: [
            {
              name: 'Peter Hudec',
              id: 'e4415b3c-945b-4b7d-89cc-759591ec45a8',
            },
            {
              name: 'Pawel Szymanski',
              id: 'e79cf08a-3214-499c-b524-fa3fd9445661',
            },
          ],
          contacts: [
            {
              name: 'Jason Day',
              email: 'jason.day@test.com',
              id: '6be3b9e0-fe8f-458c-afdb-300636f26acd',
            },
            {
              name: 'Super Awesome',
              email: 'super@awesome.com',
              id: 'ffc679ed-817e-41b1-b3c3-0a110cef0280',
            },
          ],
          destination_country: {
            name: 'Abu Dhabi',
            id: '98daa2d6-168f-4ad2-b2c4-a71fd9a59968',
          },
          sector: {
            name: 'Advanced engineering : Metals, minerals and materials',
            id: 'a522c9d2-5f95-e211-a939-e4115bead28a',
          },
          exporter_experience: {
            name: 'Never exported',
            id: '051a0362-d1a9-41c0-8a58-3171e5f59a8e',
          },
          estimated_win_date: '2023-07-01',
          estimated_export_value_amount: '1000000',
          estimated_export_value_years: {
            name: '2 years',
            id: 'b94fbe96-c013-4dca-9b69-3c443652fd8d',
          },
          export_potential: 'high',
          created_on: '2024-02-19T15:42:24.833586Z',
          modified_on: '2024-02-19T16:55:47.765904Z',
          archived: false,
          archived_on: null,
          archived_reason: null,
          title: 'Super duper',
          status: 'active',
          notes: '',
          created_by: '73d89d55-68b2-4bb9-9c7c-eedbb1548b94',
          modified_by: '73d89d55-68b2-4bb9-9c7c-eedbb1548b94',
          archived_by: null,
        },
      ],
    }

    beforeEach(() => {
      cy.setUserFeatureGroups(['export-wins'])
    })

    afterEach(() => {
      cy.resetUser()
    })

    it('When there are no exports', () => {
      cy.visit('/export')
      cy.contains('a', 'View export wins').click()
      cy.url().should('eq', API_BASE + '/exportwins/rejected')
    })

    it('When there are exports', () => {
      cy.intercept('GET', '/api-proxy/v4/export/owner', [])
      cy.intercept('GET', /\/api-proxy\/v4\/export\?/, EXPORT_RESPONSE)

      cy.visit('/export')
      cy.contains('h2', '1 Exports')
      cy.contains('a', 'View export wins').click()
      cy.url().should('eq', API_BASE + '/exportwins/rejected')
    })
  })
})
