import { assertRequestUrl } from '../../support/assertions'
import { exportListFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const transformOptions = (options) =>
  [...options].map((o) => ({
    value: o.value,
    label: o.label,
  }))

const endpoint = '/api-proxy/v4/export'
const queryParams = 'limit=10&page=1&offset=0&archived=false'
const requestUrl = `${endpoint}?${queryParams}`
const exportTab = urls.exportPipeline.index()

describe('Export pipeline sort', () => {
  context('Default sort', () => {
    const element = '[data-test="sortby-select"] option'
    const exports = exportListFaker(3)

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&sortby=created_on%3Adesc`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqList')
      cy.intercept('GET', '/api-proxy/v4/export/owner', [])
      cy.visit(exportTab)
    })

    it('should apply the default sort', () => {
      assertRequestUrl('@apiReqList', `${requestUrl}&sortby=created_on%3Adesc`)
    })

    it('should have all sort options', () => {
      cy.get(element).then((options) => {
        expect(transformOptions(options)).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'title', label: 'Export title A-Z' },
          { value: '-title', label: 'Export title Z-A' },
          { value: 'company__name', label: 'Company name A-Z' },
          { value: '-company__name', label: 'Company name Z-A' },
          {
            value: 'estimated_win_date',
            label: 'Earliest expected date for win',
          },
          {
            value: '-estimated_win_date',
            label: 'Latest expected date for win',
          },
          { value: 'estimated_export_value_amount', label: 'Value increasing' },
          {
            value: '-estimated_export_value_amount',
            label: 'Value decreasing',
          },
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby-select"] select'
    const exports = exportListFaker(3)

    beforeEach(() => {
      // ----------------------------------------------------------------------------
      // CreatedOn
      // ----------------------------------------------------------------------------

      cy.intercept('GET', `${requestUrl}&sortby=created_on%3Adesc`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqCreatedOn')

      // ----------------------------------------------------------------------------
      // Title
      // ----------------------------------------------------------------------------

      cy.intercept('GET', `${requestUrl}&sortby=title`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqTitleAsc')

      cy.intercept('GET', `${requestUrl}&sortby=-title`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqTitleDesc')

      // ----------------------------------------------------------------------------
      // Company name
      // ----------------------------------------------------------------------------

      cy.intercept('GET', `${requestUrl}&sortby=company__name`).as(
        'apiReqCompanyAsc'
      )

      cy.intercept('GET', `${requestUrl}&sortby=-company__name`).as(
        'apiReqCompanyDesc'
      )

      // ----------------------------------------------------------------------------
      // Estimated win date
      // ----------------------------------------------------------------------------

      cy.intercept('GET', `${requestUrl}&sortby=estimated_win_date`).as(
        'apiReqWinDateAsc'
      )

      cy.intercept('GET', `${requestUrl}&sortby=-estimated_win_date`).as(
        'apiReqWinDateDesc'
      )

      // ----------------------------------------------------------------------------
      // Estimated export value amount
      // ----------------------------------------------------------------------------

      cy.intercept(
        'GET',
        `${requestUrl}&sortby=estimated_export_value_amount`
      ).as('apiReqValueAsc')

      cy.intercept(
        'GET',
        `${requestUrl}&sortby=-estimated_export_value_amount`
      ).as('apiReqValueDesc')

      // ----------------------------------------------------------------------------
      // Owner
      // ----------------------------------------------------------------------------
      cy.intercept('GET', '/api-proxy/v4/export/owner', [])

      cy.visit(exportTab)
      cy.wait('@apiReqCreatedOn')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Value decreasing') // Select something else first
      cy.get(element).select('Recently created')
      cy.wait('@apiReqCreatedOn').then(() =>
        cy.url().should('include', 'sortby=created_on%3Adesc')
      )
    })

    it('should sort by "Export title A-Z"', () => {
      cy.get(element).select('Export title A-Z')
      cy.wait('@apiReqTitleAsc').then(() =>
        cy.url().should('include', 'sortby=title')
      )
    })

    it('should sort by "Export title Z-A"', () => {
      cy.get(element).select('Export title Z-A')
      cy.wait('@apiReqTitleDesc').then(() =>
        cy.url().should('include', 'sortby=-title')
      )
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company name A-Z')
      cy.wait('@apiReqCompanyAsc').then(() =>
        cy.url().should('include', 'sortby=company__name')
      )
    })

    it('should sort by "Company name Z-A"', () => {
      cy.get(element).select('Company name Z-A')
      cy.wait('@apiReqCompanyDesc').then(() =>
        cy.url().should('include', 'sortby=-company__name')
      )
    })

    it('should sort by "Earliest expected date for win"', () => {
      cy.get(element).select('Earliest expected date for win')
      cy.wait('@apiReqWinDateAsc').then(() =>
        cy.url().should('include', 'sortby=estimated_win_date')
      )
    })

    it('should sort by "Latest expected date for win"', () => {
      cy.get(element).select('Latest expected date for win')
      cy.wait('@apiReqWinDateDesc').then(() =>
        cy.url().should('include', 'sortby=-estimated_win_date')
      )
    })

    it('should sort by "Value increasing"', () => {
      cy.get(element).select('Value increasing')
      cy.wait('@apiReqValueAsc').then(() =>
        cy.url().should('include', 'sortby=estimated_export_value_amount')
      )
    })

    it('should sort by "Value decreasing"', () => {
      cy.get(element).select('Value decreasing')
      cy.wait('@apiReqValueDesc').then(() =>
        cy.url().should('include', 'sortby=-estimated_export_value_amount')
      )
    })
  })
})
