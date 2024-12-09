import { exportWinsFaker } from '../../fakers/export-wins'
import urls from '../../../../../src/lib/urls'

describe('Dashboard', () => {
  it('should display the correct filters', () => {
    cy.intercept('GET', '/api-proxy/v4/export-win?*', {
      count: 2,
      results: [exportWinsFaker(), exportWinsFaker()],
    }).as('apiRequest')
    cy.visit(urls.companies.exportWins.pending())
    cy.wait('@apiRequest')
    cy.contains('label', 'Sort by').within(() => {
      cy.get('select option:selected').should('have.text', 'Newest')
      cy.get('select').select('Oldest')
    })
  })
})
