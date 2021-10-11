const urls = require('../../../../../src/lib/urls')
const completeOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const {
  assertBreadcrumbs,
  assertLocalHeader,
} = require('../../support/assertions')

describe('Status change form', () => {
  beforeEach(() => {
    cy.visit(urls.investments.opportunities.status(completeOpportunity.id))
  })
  context('when rendering the form', () => {
    it('should display correct breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments?page=1&sortby=created_on:desc',
        'UK opportunities': '/investments/opportunities',
        [completeOpportunity.name]: urls.investments.opportunities.details(
          completeOpportunity.id
        ),
        'Change status': '',
      })
    })
    it('should render the header', () => {
      assertLocalHeader('Change opportunity status')
    })
    it('should show all the options', () => {
      cy.contains('Seeking investment').should('be.visible')
      cy.contains('Part funded').should('be.visible')
      cy.contains('Fully funded').should('be.visible')
      cy.contains('Suspended').should('be.visible')
      cy.contains('Abandoned').should('be.visible')
    })
  })
  context('when submitting the form', () => {
    it('should redirect to the details page after submitting', () => {
      cy.contains('Fully funded').click()
      cy.contains('Save').click()
      cy.url().should(
        'include',
        urls.investments.opportunities.details(completeOpportunity.id)
      )
    })
  })
  context('when cancelling the form', () => {
    it('should redirect to the details page', () => {
      cy.contains('Cancel').click()
      cy.url().should(
        'include',
        urls.investments.opportunities.details(completeOpportunity.id)
      )
    })
  })
})
