import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_DAY_MONTH_YEAR,
} from '../../../../../src/client/utils/date-utils'

describe('Investment project propositions', () => {
  context('When the project has one proposition linked', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.propositions(
          fixtures.investment.investmentWithDetails.id
        )
      )
    })

    it('should display the propositions list', () => {
      cy.get('[data-test="collection-header').should(
        'contain',
        '3 propositions'
      )
    })

    it('should show the current and number of pages', () => {
      cy.contains('Page 1 of 1').should('be.visible')
    })

    it('should display the correct number of propositions', () => {
      cy.get('[data-test="collection-item"]').should('have.length', 3)
    })

    it('should show the proposition details in the collection list item', () => {
      cy.get('[data-test="collection-item"]')
        .find('a')
        .should('contain', 'Univeristy Proposition')
        .and(
          'have.attr',
          'href',
          urls.investments.projects.proposition.details(
            '18750b26-a8c3-41b2-8d3a-fb0b930c2270',
            '3322750d-a645-4460-b584-8f9254459246'
          )
        )

      const itemLabels = '[data-test="metadata-label"]'
      cy.get(itemLabels).eq(0).should('have.text', 'Deadline')
      cy.get(itemLabels).eq(1).should('have.text', 'Created on')
      cy.get(itemLabels).eq(2).should('have.text', 'Adviser')

      const itemValues = '[data-test="metadata-value"]'
      cy.get(itemValues)
        .eq(0)
        .should(
          'have.text',
          `${formatDate(new Date(), DATE_FORMAT_DAY_MONTH_YEAR)}`
        )
      cy.get(itemValues).eq(1).should('have.text', '15 June 2017')
      cy.get(itemValues).eq(2).should('have.text', 'Paula Churing')

      cy.get('[data-test="badge"]').should('exist').should('contain', 'Ongoing')
      cy.get('[data-test="abandon-button"]')
        .should('exist')
        .should('contain', 'Abandon')
      cy.get('[data-test="complete-button"]')
        .should('exist')
        .should('contain', 'Complete')
    })

    it('should not show pagination', () => {
      cy.get('[data-test=pagination]').should('not.exist')
    })
  })
})
