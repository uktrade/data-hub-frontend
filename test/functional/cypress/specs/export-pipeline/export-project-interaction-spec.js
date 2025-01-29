import fixtures from '../../fixtures'
import { assertUrl } from '../../support/assertions'

const companyExportProject = fixtures.export.exportProjectDetails
const queryParams = '&limit=10&offset=0'

describe('Export project interaction collection list', () => {
  context('When export project render with multiple interaction linked', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
    })

    it('should display the interactions list', () => {
      cy.get('[data-test="collection-header-name').should(
        'contain',
        '1,233 interactions'
      )
    })

    it('should show the current and number of pages', () => {
      cy.contains('Page 1 of 124').should('be.visible')
    })

    it('should display 10 interactions per page', () => {
      cy.get('[data-test="collection-item"]').should('have.length', 10)
    })

    it('should show the pagination', () => {
      cy.get('[data-test="pagination"]').should('be.visible')
      cy.get('[data-test="page-number-active"]').should('have.text', '1')
      cy.get('[data-test="page-number"]').should('contain', '124')
      cy.get('[data-test="next"]').should('have.text', 'Next page')
    })
  })
})

describe('Export interaction collections filters "Sort by"', () => {
  context('Default sort by "Recently created"', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
    })

    it('should render "Sort by" label', () => {
      cy.get('[data-test="sortby"]').should('contain', 'Sort by')
    })

    it('should have all sort by options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          name: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: '-created_on', name: 'Recently created' },
          { value: 'company__name', name: 'Company name A-Z' },
          { value: 'subject', name: 'Subject A-Z' },
        ])
      })
    })
  })

  context('Other sort by filters', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company name A-Z')
      assertUrl('sortby=company__name')
    })

    it('should sort by "Subject A-Z"', () => {
      cy.get(element).select('Subject A-Z')
      assertUrl('sortby=subject')
    })
  })
})
