const {
  // assertSummaryTable,
  // assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
// const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Company overview page', () => {
  context(
    'when viewing company overview the tab should display Overview',
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
    }
  )
  context(
    'when viewing the Business details card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table including all keys and values for All Overview Details Inc.', () => {
      it('the card should contain the Business details table including all keys and values for All Overview Details Inc.', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th').contains('Companies House')
        cy.get('td').contains('01261539').parent().next().children()
        cy.get('th').contains('Trading Address')
        cy.get('td').children()
        cy.get('li').contains('1 Way Road').parent().parent().parent().next()
        cy.get('th').contains('Website')
        cy.get('td')
          .contains('http://all-the-details.com')
          .parent()
          .parent()
          .next()
        cy.get('th').contains('Turnover')
        cy.get('td').contains('£1,000,000').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('260').parent().next()
        cy.get('th').contains('DIT Sector')
        cy.get('td').contains('Retail')
        cy.get('th').contains('Turnover')
        cy.get('td').contains('£1,000,000').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('260').parent().next()
        cy.get('th').contains('DIT Sector')
        cy.get('td').contains('Retail')
      })

      it('the card should link to the business overview page', () => {
      it('the card should link to the business overview page', () => {
        cy.get('[data-test="business-page-link"]')
          .contains('View full business details')
          .click()
        cy.location('pathname').should(
          'eq',
          '/companies/ba8fae21-2895-47cf-90ba-9273c94dab88/business-details'
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table with all values set to "Not set"', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th').contains('Companies House')
        cy.get('td').contains('Not set').parent().next().children()
        cy.get('th').contains('Trading Address')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Website')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Turnover')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('DIT Sector')
        cy.get('td').contains('Not set')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table with all values set to "Not set"', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th').contains('Companies House')
        cy.get('td').contains('Not set').parent().next().children()
        cy.get('th').contains('Trading Address')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Website')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Turnover')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('Not set').parent().next()
        cy.get('th').contains('DIT Sector')
        cy.get('td').contains('Not set')
      })
    }
  )
})
