const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

describe('Local header trading names', () => {
  context(
    'when viewing the local header for a company with 2 trading names',
    () => {
      beforeEach(() => {
        cy.visit(urls.companies.activity.index(fixtures.company.dnbLtd.id))
      })

      it('should display the company trading names', () => {
        cy.get('[data-test="trading-names"]').should(
          'have.text',
          'Trading as DnB, D&B'
        )
      })
    }
  )

  context(
    'when viewing the local header for a company with 1 trading name',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
        )
      })

      it('should display the company trading name', () => {
        cy.get('[data-test="trading-names"]').should(
          'have.text',
          'Trading as DnB Global Ultimate'
        )
      })
    }
  )

  context(
    'when viewing the local header for a company with no trading names',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.activity.index(fixtures.company.dnbSubsidiary.id)
        )
      })

      it('should display the company trading name', () => {
        cy.get('[data-test="trading-names"]').should('not.exist')
      })
    }
  )
})
