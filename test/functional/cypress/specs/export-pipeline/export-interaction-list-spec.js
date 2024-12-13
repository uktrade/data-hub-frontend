const assertRequestUrl = require('../../support/assertions')
const interactionListFaker = require('../../fakers/interactions')
const urls = require('../../../../../src/lib/urls')

const endpoint = 'TBC'
const queryParams = 'TBC'
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
      cy.intercept('GET', `${requestUrl}&sortby=created_on%Adesc`, {
        body: {
          count: exportInteractionsFaker.length,
          results: exportInteractionsFaker,
        },
      }).as('apiReqInteractionList')
      cy.intercept('GET', `${endpoint}`, [])
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

  // TODO: Data result assertion
  context('User sort options', () => {
    it('should sort by "Recently created"', () => {})
    it('should sort by "Company name A-Z"', () => {})
    it('should sort by "Subject A-Z"', () => {})
  })
})
