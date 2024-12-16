const assertRequestUrl = require('../../support/assertions')
const interactionListFaker = require('../../fakers/interactions')
const urls = require('../../../../../src/lib/urls')

const endpoint = 'TBC'
const queryParams = 'TBC'
const exportOwnEndpoint = '/api-proxy/v4/export/owner'
const requestUrl = `${endpoint}?${queryParams}`
const exportInteractions = urls.exportPipeline.interactions

const transformOptions = (options) =>
  [...options].map((o) => ({
    value: o.value,
    label: o.label,
  }))

describe('Export project interaction sort', () => {
  context('Default sort', () => {
    const element = '[data-test="sortby-select"] option'
    const exportInteractionsFaker = interactionListFaker(3)

    beforeEach(() => {
      cy.intercept('GET', `${requestUrl}&sortby=created_on%3Adesc`, {
        body: {
          count: exportInteractionsFaker.length,
          results: exportInteractionsFaker,
        },
      }).as('apiReqInteractionList')
      cy.intercept('GET', `${exportOwnEndpoint}`, [])
      cy.visit(exportInteractions)
    })

    it('should render default sort', () => {
      assertRequestUrl(
        '@apiReqInteractionList',
        `${requestUrl}&sortby=created_on%3Adesc`
      )
    })

    it('should render all sort options', () => {
      cy.get(element).then((option) => {
        expect(
          transformOptions(option).to.deep.eq([
            { value: 'created_on:desc', label: 'Recently created' },
            { value: 'company__name', label: 'Company name A-Z' },
            { value: 'subject', label: 'Subject A-Z' },
          ])
        )
      })
    })
  })

  context('User sort options', () => {
    const element = '[data-test="sortby-select"] select'
    const exportInteractionsFaker = interactionListFaker(3)

    beforeEach(() => {
      // Sort by created_on
      cy.intercept('GET', `${requestUrl}&sortby=created_on%3Adesc`, {
        body: {
          count: exportInteractionsFaker.length,
          results: exportInteractionsFaker,
        },
      }).as('apiReqCreatedOn')

      // Sort by company__name
      cy.intercept('GET', `${requestUrl}&sortby=company__name`).as(
        'apiReqCompanyAsc'
      )

      // Sort by subject
      cy.intercept('GET', `${requestUrl}&sortby=subject`, {
        body: {
          count: exportInteractionsFaker.length,
          results: exportInteractionsFaker,
        },
      }).as('apiReqSubjectAsc')

      // Get owners created export
      cy.intercept('GET', `${exportOwnEndpoint}`, [])
      cy.visit(exportInteractions)
      cy.wait('@apiReqCreatedOn')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Company name A-Z') // Select other option first
      cy.get(element).select('Recently created')
      cy.wait('@apiReqCreatedOn').then(() =>
        cy.url().should('include', 'sortby=created_on%3Adesc')
      )
    })
    // TODO: Data result assertion
    it('should sort by "Company name A-Z"', () => {})
    it('should sort by "Subject A-Z"', () => {})
  })
})
