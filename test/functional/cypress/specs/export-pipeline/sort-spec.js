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

    before(() => {
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
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby-select"] select'
    const exports = exportListFaker(3)

    beforeEach(() => {
      // sortby=created_on:desc
      cy.intercept('GET', `${requestUrl}&sortby=created_on%3Adesc`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqSortbyCreatedOn')
      // sortby=title (A-Z)
      cy.intercept('GET', `${requestUrl}&sortby=title`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqSortbyTitleA-Z')
      // sortby=-title (Z-A)
      cy.intercept('GET', `${requestUrl}&sortby=-title`, {
        body: {
          count: exports.length,
          results: exports,
        },
      }).as('apiReqSortbyTitleZ-A')
      cy.intercept('GET', '/api-proxy/v4/export/owner', [])
      cy.visit(exportTab)
    })

    it('should sort by "Recently created"', () => {
      // As "Recently created" is the default sort
      // we need to select another option first
      cy.get(element).select('Export title A-Z')
      cy.wait('@apiReqSortbyTitleA-Z')
      cy.get(element).select('Recently created')
      assertRequestUrl(
        '@apiReqSortbyCreatedOn',
        `${requestUrl}&sortby=created_on%3Adesc`
      )
    })

    it('should sort by "Export title A-Z"', () => {
      cy.get(element).select('Export title A-Z')
      assertRequestUrl('@apiReqSortbyTitleA-Z', `${requestUrl}&sortby=title`)
    })

    it('should sort by "Export title Z-A"', () => {
      cy.get(element).select('Export title Z-A')
      assertRequestUrl('@apiReqSortbyTitleZ-A', `${requestUrl}&sortby=-title`)
    })
  })
})
