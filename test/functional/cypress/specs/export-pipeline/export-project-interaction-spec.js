import urls from '../../../../../src/lib/urls'
import fixtures from '../../fixtures'
import { assertUrl } from '../../support/assertions'

const companyExportProject = fixtures.export.exportProjectDetails

const companyExportInteractionsEndpoint = '/api-proxy/v4/interaction'
const queryParams = '&limit=10&offset=0'
const requestUrl = `${companyExportInteractionsEndpoint}?company_export_id=${companyExportProject.id}`

describe('Export project interaction collections "Sort by"', () => {
  context('Default sort by "Recently created"', () => {
    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}${queryParams}&sortby=-created_on`).as(
        'apiRequest'
      )
      cy.visit(urls.exportPipeline.interactions.index(companyExportProject.id))
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

  context('User sort', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}${queryParams}&sortby=-created_on`).as(
        'apiRequest'
      )
      cy.visit(urls.exportPipeline.interactions.index(companyExportProject.id))
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
