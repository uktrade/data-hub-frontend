const {
  // assertSummaryTable,
  // assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
// const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Company overview page', () => {
  context(
    'when viewing company overview the page should display the company overview and overview cards',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('tab should contain the text Overview', () => {
        cy.get('[data-test="tabbedLocalNavList"]')
          .children()
          .children()
          .should('contain.text', 'Overview')
      })

      it('tab should contain the Business details table and all detail of All Overview Details Inc.', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
          .children()
          .contains('Companies House')
          .next()
          .contains('01261539')
          .parent()
          .next()
          .children()
          .contains('Trading Address')
          .next()
          .children()
          .contains('1 Way Road')
          .parent()
          .parent()
          .parent()
          .next()
          .children()
          .contains('Website')
          .next()
          .contains('http://all-the-details.com')
      })
    }
  )
})
