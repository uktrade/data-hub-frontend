import urls from '../../../../../src/lib/urls'

describe('Dashboard', () => {
  it('should display the correct filters', () => {
    cy.visit(urls.companies.exportWins.pending())
    cy.contains('label', 'Sort by').within(() => {
      cy.get('select option:selected').should('have.text', 'Newest')
      cy.get('select').select('Oldest')
    })
  })
})
